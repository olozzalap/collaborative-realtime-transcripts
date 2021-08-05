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
	}
});

const Conversation = mongoose.model('conversation', ConversationSchema);
module.exports = Conversation;
