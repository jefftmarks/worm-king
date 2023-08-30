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
		type: String,
		required: true,
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
	}
});

module.exports = mongoose.model('Book', BookSchema);