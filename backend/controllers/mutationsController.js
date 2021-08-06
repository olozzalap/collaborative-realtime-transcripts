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
            authorIndex: authorNames.indexOf(req.author),
            index: req.data.index,
            isInsert: req.data.type === 'insert' ? true : false,
            length: req.data.length,
            origin: [req.origin.bob, req.origin.alice],
            text: req.data.text,
        });

        respJson.text = parseConversationText(conversation.mutations);

        

        // newMutation is fully up-to-date
        if (!(conversation.mutationCounts[0] === req.origin.bob && conversation.mutationCounts[1] === req.origin.alice)) {
            newMutation = transformMutation(newMutation, conversation.mutations, conversation.mutationCounts);   
        }

        respJson.text = parseSingleMutation(newMutation, respJson.text);

        conversation.mutations.push(newMutation);
        conversation.mutationCounts[newMutation.authorIndex] += 1;
        conversation.lastMutationAt = Date.now();

        newMutation.save();
        conversation.save();
    } catch (e) {
        respJson.msg = `ERROR: ${JSON.stringify(e)}`;
    } finally {
        return respJson;
    }
};



module.exports = {
    submitMutation
};