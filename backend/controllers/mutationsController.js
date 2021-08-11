const Conversation = require('../models/Conversation');
const Mutation = require('../models/Mutation');
const { parseConversationText, parseSingleMutation, transformMutation } = require('../helpers/transformationHelper');
const { authorNames } = require('../../constants');

const submitMutation = async (req, res) => {
    console.warn(`
        req.body is:`)
    console.warn(req.body)
    // console.warn(JSON.stringify(req.body))
    // console.warn(`
    //     req.x is:`)
    // console.warn(req.x)
    // console.warn(JSON.stringify(req.x))
    // console.warn(req)

    const respJson = {
        "msg": '',
        "ok": true,
        "text": '',
        "origin": {},
        "newIndex": null,
    };

    try {
        const conversation = await Conversation.findById(req.body.conversationId).populate('mutations').exec();
        const conversationOriginStateJSON = JSON.parse(conversation.originState);

        let newMutation = new Mutation({
            conversation: conversation.id,
            author: req.body.author,
            index: req.body.index,
            isInsert: req.body.type === 'insert' ? true : false,
            length: req.body.length,
            origin: req.body.origin,
            text: req.body.text,
        });

        const newMutationOriginJSON = JSON.parse(newMutation.origin);
        const newMutationOriginKeys = Object.keys(newMutationOriginJSON);

        console.warn(newMutation)

        // newMutation is behind and will need transforming
        if (
            newMutationOriginKeys.length !== Object.keys(conversationOriginStateJSON).length || 
            newMutationOriginKeys.find(author => newMutationOriginJSON[author] < conversationOriginStateJSON[author])
        ) {
            newMutation = await transformMutation(newMutation, conversation.mutations);   
        }

        console.warn(`
            pre await newMutation.save();
            `)        

        await newMutation.save();

        conversation.lastMutationAt = Date.now();

        if (conversationOriginStateJSON[newMutation.author]) {
            conversationOriginStateJSON[newMutation.author] += 1;
        } else {
            conversationOriginStateJSON[newMutation.author] = 1;
        }

        const existingConvoText = await parseConversationText(conversation.mutations);

        console.warn(`
            existingConvoText is: ${existingConvoText}
            `)

        conversation.originState = JSON.stringify(conversationOriginStateJSON);
        conversation.mutations.push(newMutation.id);
        await conversation.save();

        respJson.text = parseSingleMutation(newMutation, existingConvoText);
        respJson.origin = conversationOriginStateJSON;
        respJson.newIndex = newMutation.index;
    } catch (e) {
        respJson.msg = `ERROR: ${JSON.stringify(e)}`;
        respJson.ok = false;
    } finally {
        res.json(respJson);
    }
};



module.exports = {
    submitMutation
};