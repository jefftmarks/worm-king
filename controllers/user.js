const User = require('../models/user');

const createUser = async (input) => {
	const user = await User.create({
		username: input
	});

	if (user) {
		user.save();
	}

	return user;
};

module.exports = { createUser };