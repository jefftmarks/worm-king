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
		type: String,
		required: true,
	},
	read_date: {
		type: String,
		required: true,
	},
	current: {
		type: Boolean
	},
	readings: [{
		type: mongoose.Types.ObjectId,
		ref: 'Reading'
	}]
});

module.exports = mongoose.model('Book', BookSchema);