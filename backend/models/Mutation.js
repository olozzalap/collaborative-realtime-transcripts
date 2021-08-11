const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Conversation = require('./Conversation');

const MutationSchema = new Schema({
    conversation: {type: Schema.Types.ObjectId, ref: 'conversation'},
	author: {type: String},
    index: {type: Number},
    isInsert: {type: Boolean}, // true: insert operation, false: delete operation
    length: {type: Number},
    origin: {type: String}, // JSON.stringify( { author: numMutations } )
    text: {type: String},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Mutation = mongoose.model('mutation', MutationSchema);
module.exports = Mutation;