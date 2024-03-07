const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { getStatmojis } = require('../utils/emojifier');

const buildStatusSelector = async () => {
	const statmojis = await getStatmojis()

	selector = new StringSelectMenuBuilder()
		.setCustomId('updateStatus')
		.setPlaceholder(`Update Reading Status`)
		.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel('unread')
				.setValue('unread')
				.setEmoji(statmojis.get('unread')),
			new StringSelectMenuOptionBuilder()
				.setLabel('started')
				.setValue('started')
				.setEmoji(statmojis.get('started')),
			new StringSelectMenuOptionBuilder()
				.setLabel('finished')
				.setValue('finished')
				.setEmoji(statmojis.get('finished'))
		);

	return selector;
}

module.exports = buildStatusSelector;