const Conversation = require('../models/Conversation');
const Mutation = require('../models/Mutation');
const { parseConversationText, parseSingleMutation, transformMutation } = require('../helpers/transformationHelper');
const { authorNames } = require('../../constants');

const submitMutation = async (req, res) => {
    console.warn(req)

    const respJson = {
        "msg": '',
        "ok": true,
        "text": '',
    };

    try {
        const conversation = await Conversation.findById(req.conversationId);

        let newMutation = new Mutation({
            conversation,
            author: req.author,
            index: req.data.index,
            isInsert: req.data.type === 'insert' ? true : false,
            length: req.data.length,
            origin: req.origin,
            text: req.data.text,
        });

        const newMutationOriginKeys = Object.keys(newMutation.origin);

        // newMutation is behind and will need transforming
        if (
            newMutationOriginKeys.length !== Object.keys(conversation.originState).length || 
            newMutationOriginKeys.find(author => newMutation.origin[author] < conversation.originState[author])
        ) {
            newMutation = await transformMutation(newMutation, conversation.mutations);   
        }

        conversation.mutations.push(newMutation);
        conversation.originState[newMutation.author] += 1;
        conversation.lastMutationAt = Date.now();

        await newMutation.save();
        await conversation.save();

        const existingConvoText = await parseConversationText(conversation.mutations);
        respJson.text = parseSingleMutation(newMutation, existingConvoText);
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