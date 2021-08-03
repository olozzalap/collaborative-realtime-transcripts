const Conversation = require('../models/Conversation');

const getAllConversations = async (req, res) => {
    const result = await Conversation.find({});
    console.warn(`
        result is: !!
        `);
    console.warn(result);
    res.json(result);
};

module.exports = {
    getAllConversations
};