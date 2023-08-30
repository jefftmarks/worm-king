const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current')
		.setDescription('Returns current book'),
	async execute(interaction) {
		const book = await Book.findOne({ current: true });

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