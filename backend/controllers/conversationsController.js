const Conversation = require('../models/Conversation');
const Mutation = require('../models/Mutation');
const { parseConversationText } = require('../helpers/transformationHelper');

const createConversation = async (req, res) => {
    const respJson = {
        "ok": true,
        "msg": '',
        "newConversation": null,
    };

    try {
        const initMutation = new Mutation({
            author: req.author,
            index: 0,
            isInsert: true,
            length: 1,
            origin: {},
            text: ' ',
        });
        const newConversation = new Conversation({
            mutations: [initMutation],
            title: req.title,
            originState: {
                [req.author]: 1,
            },
        });

        initMutation.conversation = newConversation;

        await initMutation.save();
        await newConversation.save();

        respJson.newConversation = newConversation;
    } catch (e) {
        respJson.msg = `ERROR: ${JSON.stringify(e)}`;
        respJson.ok = false;
    } finally {
        res.json(respJson);
    }
};

const deleteConversation = async (req, res) => {
    const respJson = {
        "ok": true,
        "msg": '',
    };

    try {
        await Conversation.deleteOne({ id: req.id });
        respJson.msg = 'success';
    } catch (e) {
        respJson.msg = `ERROR: ${JSON.stringify(e)}`;
        respJson.ok = false;
    } finally {
        res.json(respJson);
    }
};

const getAllConversations = async (req, res) => {
    const conversations = await Conversation.find({}).populate('mutations').exec();
 
    const conversationsWithText = await Promise.all(conversations.map( async ({ _doc: convo }) => {
        console.warn(parseConversationText)

        const convoText = await parseConversationText(convo.mutations);
        
        return {
            "id": convo._id,
            "createdAt": convo.createdAt,
            "lastMutation": convo.mutations[convo.mutations.length - 1],
            "lastMutationAt": convo.lastMutationAt,
            "text": convoText,
            "title": convo.title,
            "mutations": convo.mutations,
            "originState": convo.originState,
        }
    }));
    console.warn(conversationsWithText)

    res.json(conversationsWithText);
};

module.exports = {
    createConversation,
    deleteConversation,
    getAllConversations,
};