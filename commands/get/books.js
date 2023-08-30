const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');
const { formatDate } = require('../../utils');

const BOOKMOJIS = ['📘','📕','📗','📙'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('books')
		.setDescription('Returns list of book club books'),
	async execute(interaction) {
		const books = await Book.find().sort({ read_date: 'asc' });

		if (!books) {
			await interaction.reply("ERROR!");
		}

		const entries = [];

		for (let i = 0; i < books.length; i++) {
			const { title, author, picked_by, read_date, current } = books[i];
	
			entries.push(`
🪱${current ? '📖' : BOOKMOJIS[i % 4]}  **${title}**
              by ${author}
              picked by ${picked_by} (${formatDate(read_date)})
			`);
		}

		await interaction.reply(entries.join(''));
	},
};