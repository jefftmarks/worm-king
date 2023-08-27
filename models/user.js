const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	readings: [{
		type: mongoose.Types.ObjectId,
		ref: 'Reading'
	}]
});

module.exports = mongoose.model('User', UserSchema);