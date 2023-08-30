const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');
require('dotenv').config();
const { formatDate } = require('../../utils');
const connectDB = require('../../db/connect');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('books')
		.setDescription('Returns list of book club books'),
	async execute(interaction) {
		const db = await connectDB(process.env.MONGO_URI);

		if (!db) {
			await interaction.reply("ERROR!");
		}

		const books = await Book.find().sort({ read_date: 'asc' });

		if (!books) {
			await interaction.reply("ERROR!");
		}

		const entries = [];
		const bookmojis = ['📘','📕','📗','📙'];

		for (let i = 0; i < books.length; i++) {
			const { title, author, picked_by, read_date, current } = books[i];
	
			entries.push(`
🪱${current ? '📖' : bookmojis[i % 4]}  **${title}**
              by ${author}
              picked by ${picked_by} (${formatDate(read_date)})
			`);
		}

		await interaction.reply(entries.join(''));
	},
};