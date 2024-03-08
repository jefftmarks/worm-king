const { SlashCommandBuilder } = require('discord.js');
const { modifyResponse } = require('../../utils/themeHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll the dice'),
	async execute(interaction) {
		const response = await modifyResponse('⚠️ FEATURE IN DEVELOPMENT ⚠️');
		interaction.reply(response);
	},
};