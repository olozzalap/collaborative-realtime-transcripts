const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Conversation = require('./Conversation');

const MutationSchema = new Schema({
    _id: Schema.Types.ObjectId,
    conversation: {type: Schema.Types.ObjectId, ref: 'conversation'},
	authorIndex: {type: Number}, // 0: Bob, 1: Alice
    index: {type: Number},
    isInsert: {type: Boolean}, // true: insert operation, false: delete operation
    length: {type: Number},
    origin: [Number, Number],
    text: {type: String},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Mutation = mongoose.model('mutation', MutationSchema);
module.exports = Mutation;