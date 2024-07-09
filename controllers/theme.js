const Theme = require('../models/theme');
const { fieldsMapToObject } = require('../utils/utils');

const createTheme = async (fields) => {
	const fieldsObj = fieldsMapToObject(fields);
	const {
		nameInput,
		unreadEmoji,
		startedEmoji,
		finishedEmoji,
		themeIcon
	} = fieldsObj;

	const theme = await Theme.create({
		name: nameInput,
		emojis: {
			unread: unreadEmoji,
			started: startedEmoji,
			finished: finishedEmoji
		},
		icon: themeIcon
	});

	if (!theme) {
		return;
	}

	return theme;
};

module.exports = { createTheme };