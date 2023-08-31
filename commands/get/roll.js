const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls the dice'),
	async execute(interaction) {
		interaction.reply('⚠️ FEATURE IN DEVELOPMENT ⚠️');
	},
};