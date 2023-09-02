const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	author: {
		type: String,
		required: true
	},
	picked_by: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	read_date: {
		type: String,
		required: true,
		unique: true
	},
	current: {
		type: Boolean,
		required: true,
		default: true,
	},
	readings: [{
		type: mongoose.Types.ObjectId,
		ref: 'Reading'
	}]
});

module.exports = mongoose.model('Book', BookSchema);