const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');
require('dotenv').config();
const connectDB = require('../../db/connect');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current')
		.setDescription('Returns current book'),
	async execute(interaction) {
		const db = await connectDB(process.env.MONGO_URI);

		if (!db) {
			await interaction.reply("ERROR!");
		}

		const book = await Book.findOne({ current: true });
		console.log(book);
		if (!book) {
			await interaction.reply("ERROR!");
		}

		const { title, author, picked_by } = book;

		await interaction.reply(`
🪱📖  **${title}**
              by ${author}
              picked by ${picked_by}
		`);
	},
};