const mongoose = require('mongoose');

const classicEmojis = {
	unread: '🟥',
	started: '🟨', 
	finished: '🟩',
}

const ThemeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	icon: {
		type: String,
		required: true
	},
	current: {
		type: Boolean,
		required: true,
		default: true
	},
	emojis: {
		type: Map,
		of: String,
		default: classicEmojis,
	},
	function: {
		type: String,
		default: null
	}
});

module.exports = mongoose.model('Theme', ThemeSchema);