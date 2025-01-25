const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	cache: {
		type: String
	}
});

module.exports = mongoose.model('Stat', StatSchema);