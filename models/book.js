const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	picked_by: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	readings: [{
		type: mongoose.Types.ObjectId,
		ref: 'Reading'
	}]
});

module.exports = mongoose.model('Book', BookSchema);