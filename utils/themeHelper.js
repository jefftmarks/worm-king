const Theme = require('../models/theme');
const MODIFIERS = require('./MODIFIERS');

const getStatmojis = async () => {
	const currentTheme = await Theme.findOne({ current: true });

	return currentTheme.emojis;
};

const sortStatmojis = async (emojis, theme) => {
	const rank = await buildEmojiRanker(theme);

	emojis.sort((a, b) => {
		return rank[b] - rank[a]
	});

	return emojis;
};

const buildEmojiRanker = async (theme) => {
	const statmojis = await getStatmojis();
	const rankMap = MODIFIERS[theme.function]?.rankMap || {};

	rankMap[statmojis.get('unread')] = 0;
	rankMap[statmojis.get('started')] = 1;
	rankMap[statmojis.get('finished')] = 2;

	return rankMap;
};

const bookmojis = ['📘','📕','📗','📙'];

const getBookmoji = (index, current) => {
	return current ? '📖' : bookmojis[index % 4];
};

const modify = async (input, inputType, theme = null) => {
	if (theme === null) {
		theme = await Theme.findOne({ current: true });
	}
	const modifyGroup = theme.function;

	if (modifyGroup === undefined || modifyGroup === null) {
		return input;
	}

	const modifier = MODIFIERS[modifyGroup][inputType];

	if (modifier === undefined || modifier === null) {
		return input
	}

	return modifier(input);
};



module.exports = {
	getStatmojis,
	sortStatmojis,
	getBookmoji,
	modify,
};