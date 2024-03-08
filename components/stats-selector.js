const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Book = require('../models/book');
const { getBookmoji } = require('../utils/emojifier');

const buildStatsSelector = async () => {
	selector = new StringSelectMenuBuilder()
		.setCustomId('viewStats')
		.setPlaceholder('View Stats')
		.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel('My Stats')
				.setValue('myStats')
				.setEmoji('🪱'),
			new StringSelectMenuOptionBuilder	()
				.setLabel('Club Stats')
				.setValue('clubStats')
				.setEmoji('📚')
		)

		const books = await Book.find().sort({ read_date: 'desc' });

		for (let i = 0; i < books.length; i++) {
			const book = books[i];
			selector.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(book.title)
					.setValue(book.id)
					.setEmoji(getBookmoji(i, book.current))
			)
		}

	return selector;
}

module.exports = buildStatsSelector;