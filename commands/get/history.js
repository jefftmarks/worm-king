const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');
const Reading = require('../../models/reading');

const { getStatmojis, sortStatmojis } = require('../../utils/emojifier');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('Returns reading record for all books'),
	async execute(interaction) {
		const books = await Book.find().sort({ read_date: 'asc' });

		const entries = [];
		const statmojis = await getStatmojis();

		for (const book of books) {
			const history = [];
			const readings = await Reading.find({ book: book.id });

			for (const reading of readings) {
				history.push(statmojis.get(reading.status));
			}
			sortedHistory = await sortStatmojis(history);

			entries.push(`
**${book.title}**
${sortedHistory.join('')}
			`)
		}

		await interaction.reply(entries.join(''));
	},
};