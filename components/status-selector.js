const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const buildStatusSelector = (theme) => {
	const isClassic = theme === 'classic';

	selector = new StringSelectMenuBuilder()
		.setCustomId('updateStatus')
		.setPlaceholder(`Update Reading Status`)
		.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel('unread')
				.setValue('unread')
				.setEmoji(isClassic ? '🟥' : '⬜'),
			new StringSelectMenuOptionBuilder()
				.setLabel('started')
				.setValue('started')
				.setEmoji(isClassic ? '🟨' : '🟧'),
			new StringSelectMenuOptionBuilder()
				.setLabel('finished')
				.setValue('finished')
				.setEmoji('🟩')
		);

	return selector;
}

module.exports = buildStatusSelector;