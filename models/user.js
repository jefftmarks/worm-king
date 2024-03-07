const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	discord_id: {
		type: String,
		required: true,
		unique: true
	}
});

module.exports = mongoose.model('User', UserSchema);