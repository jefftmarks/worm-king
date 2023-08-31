const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');
const User = require('../../models/user');
const { updateUsernames } = require('../../controllers/user');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current')
		.setDescription('Returns current book'),
	async execute(interaction) {
		const book = await Book.findOne({ current: true });

		if (!book) {
			await interaction.reply("ERROR!");
		}

		updateUsernames(interaction);

		const { title, author, picked_by } = book;

		const user = await User.findOne({ discord_id: picked_by });

		await interaction.reply(`
🪱📖  **${title}**
              by ${author}
              picked by ${user.username}
		`);
	},
};