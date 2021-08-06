const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mutation = require('./Mutation');

const ConversationSchema = new Schema({
	_id: Schema.Types.ObjectId,
	mutations: [{type: Schema.Types.ObjectId, ref: 'mutation'}],
	title: {type: String},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	lastMutationAt: {
		type: Date,
		default: Date.now()	
	},
	/*
		Based on lastMutation's origin[] plus an increment for either index depending if bob/alice
		USed to quickly determine if a new mutation needs transforming
	*/
	mutationCounts: [Number, Number]
});

const Conversation = mongoose.model('conversation', ConversationSchema);
module.exports = Conversation;
