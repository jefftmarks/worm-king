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
	}
});

module.exports = mongoose.model('Reading', ReadingSchema);