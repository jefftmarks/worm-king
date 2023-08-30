const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const buildBookSelector = (books) => {
	selector = new StringSelectMenuBuilder()
		.setCustomId('updateBook')
		.setPlaceholder('Book Title');
	
	books.forEach((book, idx) => {
	const { title, id, current } = book;
	
	selector.addOptions(
		new StringSelectMenuOptionBuilder()
			.setLabel(title)
			.setValue(id)
			.setEmoji(current ? '📖' : BOOKMOJIS[idx % 4])
	)
	});

	return selector;
}

module.exports = buildBookSelector;