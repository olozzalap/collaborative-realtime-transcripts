const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mutation = require('./Mutation');

const ConversationSchema = new Schema({
	mutations: [ {
		mutationId: {type: Schema.Types.ObjectId, ref: 'Mutation'},
		authorIndex: {type: Number}, // 0: Bob, 1: Alice
		index: {type: Number},
		isInsert: {type: Boolean}, // true: insert operation, false: delete operation
		length: {type: Number},
		origin: [Number],
		text: {type: String},
	}],
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
