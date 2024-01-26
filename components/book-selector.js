const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const buildBookSelector = (readings, theme) => {
	selector = new StringSelectMenuBuilder()
		.setCustomId('updateBook')
		.setPlaceholder('Book Title');
	
	readings.forEach((reading) => {
	const { book, status } = reading;
	
	const isClassic = theme === 'classic';
	const STATMOJIS = {
		unread: '🟥', 
		started: '🟨', 
		finished: isClassic ? '🟩' : '☘️',
	};

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