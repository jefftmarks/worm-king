const Theme = require('../models/theme');
const { fieldsMapToObject } = require('./utils');

const getStatmojis = async () => {
	const currentTheme = await Theme.findOne({ current: true });

	return currentTheme.emojis;
};

const sortStatmojis = async (emojis) => {
	const rank = await buildEmojiRanker();

	emojis.sort((a, b) => {
		return rank[a] - rank[b]
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

module.exports = { getStatmojis, sortStatmojis };