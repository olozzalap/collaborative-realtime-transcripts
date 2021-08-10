const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Conversation = require('./Conversation');

const MutationSchema = new Schema({
    _id: Schema.Types.ObjectId,
    conversation: {type: Schema.Types.ObjectId, ref: 'conversation'},
	author: {type: String},
    index: {type: Number},
    isInsert: {type: Boolean}, // true: insert operation, false: delete operation
    length: {type: Number},
    origin: {type: Object}, // { author: numMutations }
    text: {type: String},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Mutation = mongoose.model('mutation', MutationSchema);
module.exports = Mutation;