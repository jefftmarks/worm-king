const { SlashCommandBuilder } = require('discord.js');
const Theme = require('../models/theme');
const { modify } = require('../utils/themeHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('void')
		.setDescription('Removes unwanted text characters from your messages')
		.addStringOption(option =>
			option
				.setName('msg')
				.setDescription('The msg to void')
				.setRequired(true)),
	async execute(interaction) {
		const msg = interaction.options.getString('msg')

		const response = await modify(msg, "response");

		await interaction.reply(response);
	},
};