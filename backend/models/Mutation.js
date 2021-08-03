const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Conversation = require('./Conversation');

const MutationSchema = new Schema({
    conversationId: {type: Schema.Types.ObjectId, ref: 'Conversation'},
	authorIndex: {type: Number}, // 0: Bob, 1: Alice
    index: {type: Number},
    isInsert: {type: Boolean}, // true: insert operation, false: delete operation
    length: {type: Number},
    origin: [Number],
    text: {type: String},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Mutation = mongoose.model('mutation', MutationSchema);
module.exports = Mutation;