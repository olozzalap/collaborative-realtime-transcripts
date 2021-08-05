const Conversation = require('../models/Conversation');
const Mutation = require('../models/Mutation');
const { parseConversationText } = require('../helpers/transformationHelper');

const getAllConversations = async (req, res) => {
    const conversations = await Conversation.find({}).populate('mutations').exec();
 
    const conversationsWithText = await Promise.all(conversations.map( async ({ _doc: convo }) => {
        console.warn(parseConversationText)

        const convoText = await parseConversationText(convo.mutations);
        
        return {
            _id: convo._id,
            createdAt: convo.createdAt,
            lastMutation: convo.mutations[convo.mutations.length - 1],
            lastMutationAt: convo.lastMutationAt,
            text: convoText,
            title: convo.title,
        }
    }));
    console.warn(conversationsWithText)

    res.json(conversationsWithText);
};

module.exports = {
    getAllConversations
};