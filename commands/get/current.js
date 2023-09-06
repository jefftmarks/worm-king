const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');
const { updateUsernames } = require('../../controllers/user');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current')
		.setDescription('Returns current book'),
	async execute(interaction) {
		const book = await Book.findOne({ current: true }).populate('picked_by');

		if (!book) {
			await interaction.reply("ERROR!");
		}

		updateUsernames(interaction);

		const { title, author, picked_by } = book;

		await interaction.reply(`
🪱📖  **${title}**
              by ${author}
              picked by ${picked_by.username}
		`);
	},
};