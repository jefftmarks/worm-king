const Theme = require('../models/theme');
const MODIFIERS = require('./MODIFIERS');

const getStatmojis = async () => {
	const currentTheme = await Theme.findOne({ current: true });

	return currentTheme.emojis;
};

const sortStatmojis = async (emojis) => {
	const rank = await buildEmojiRanker();

	emojis.sort((a, b) => {
		return rank[b] - rank[a]
	});

	return emojis;
};

const buildEmojiRanker = async () => {
	const statmojis = await getStatmojis();
	const rankMap = {}

	rankMap[statmojis.get('unread')] = 0;
	rankMap[statmojis.get('started')] = 1;
	rankMap[statmojis.get('finished')] = 2;
	
	return rankMap;
};

const bookmojis = ['📘','📕','📗','📙'];

const getBookmoji = (index, current) => {
	return current ? '📖' : bookmojis[index % 4];
};

const modifyResponse = async (response) => {
	const theme = await Theme.findOne({ current: true });
	const modifyType = theme.function;

	if (!modifyType) return response;

	const modifier = MODIFIERS[modifyType];
	
	return modifier(response);
};

module.exports = {
	getStatmojis,
	sortStatmojis,
	getBookmoji,
	modifyResponse,
};