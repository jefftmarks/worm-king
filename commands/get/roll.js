const { SlashCommandBuilder } = require('discord.js');
const { modify } = require('../../utils/themeHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll the dice'),
	async execute(interaction) {
		const response = await modify('⚠️ FEATURE IN DEVELOPMENT ⚠️', "response");
		interaction.reply(response);
	},
};