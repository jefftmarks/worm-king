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

const formatUsername = (nickname) => {
	return nickname.match(/^[^{}()\[\]]*/)[0].trim();
};

const updateUsernames = async (interaction) => {
	const users = await User.find();

	for (let i = 0; i < users.length; i++) {
		const user = users[i];

		let member;
		
		try {
			member = await interaction.guild.members.fetch(user.discord_id);

			const { id, nickname } = member;
			const formattedName = formatUsername(nickname);
			await User.findOneAndUpdate({ discord_id: id }, { username: formattedName });
		} catch (error) {
			continue;
		}
	}
};

module.exports = { createUser, updateUsernames };