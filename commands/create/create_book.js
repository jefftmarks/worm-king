const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create_book')
		.setDescription('[ADMIN ONLY] Creates new book in database'),
	async execute(interaction) {
		if (interaction.user.id !== process.env.ADMIN_ID) {
			await interaction.reply("PERMISSION DENIED")
		};
		
		await interaction.reply("HI");
	},
};