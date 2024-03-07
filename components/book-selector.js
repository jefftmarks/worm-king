const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { getStatmojis } = require('../utils/emojifier');

const buildBookSelector = async(readings) => {
	selector = new StringSelectMenuBuilder()
		.setCustomId('updateBook')
		.setPlaceholder('Book Title');
	
	const statmojis = await getStatmojis()
	
	readings.forEach((reading) => {
		const { book, status } = reading;

		selector.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel(book.title)
				.setValue(book.id)
				.setEmoji(statmojis.get(status))
		)
	});

	return selector;
}

module.exports = buildBookSelector;