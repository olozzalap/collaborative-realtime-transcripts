const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mutation = require('./Mutation');

const ConversationSchema = new Schema({
	mutations: [{type: Schema.Types.ObjectId, ref: 'mutation'}],
	title: {type: String},
	/*
		Based on the most recent mutations origin plus an increment for that mutation
		Used to quickly determine if a new mutation needs transforming
	*/
	originState: {type: String}, // { author: numMutations }
	createdAt: {
		type: Date,
		default: Date.now()
	},
	lastMutationAt: {
		type: Date,
		default: Date.now()	
	},
});

const Conversation = mongoose.model('conversation', ConversationSchema);
module.exports = Conversation;
