const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const STATMOJIS = {
	unread: '🟥', 
	started: '🟨', 
	finished: '🟩',
};

const buildBookSelector = (readings) => {
	selector = new StringSelectMenuBuilder()
		.setCustomId('updateBook')
		.setPlaceholder('Book Title');
	
	readings.forEach((reading) => {
	const { book, status } = reading;
	
	selector.addOptions(
		new StringSelectMenuOptionBuilder()
			.setLabel(book.title)
			.setValue(book.id)
			.setEmoji(STATMOJIS[status])
	)
	});

	return selector;
}

module.exports = buildBookSelector;