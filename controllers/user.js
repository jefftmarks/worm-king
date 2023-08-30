const User = require('../models/user');
const { fieldsMapToObject } = require('../utils');
const { createReadingsOnCreation } = require('../controllers/reading');

const createUser = async (fields) => {
	const fieldsObj = fieldsMapToObject(fields);
	const {
		usernameInput,
		discordIdInput,
	} = fieldsObj;

	const user = await User.create({
		username: usernameInput,
		discord_id: discordIdInput,
	});

	if (!user) {
		return;
	}

	const readings = await createReadingsOnCreation(user);

	if (!readings) {
		return;
	}

	return user;
};

module.exports = { createUser };