const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	book: {
		type: mongoose.Types.ObjectId,
		ref: 'Book'
	},
	status: {
		type: String,
		required: true,
		enum: ["unread", "started", "finished"],
		default: "unread"
	}
});

module.exports = mongoose.model('Reading', ReadingSchema);