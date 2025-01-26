const fs = require('node:fs');
const path = require('path');
const { modify } = require('../../utils/themeHelper');

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Returns list of available commands'),
	async execute(interaction) {
		const foldersPath = path.resolve(__dirname, '..');
		const commandFolders = fs.readdirSync(foldersPath);

		const entries = [];
		
		for (const folder of commandFolders) {
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
			
			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const { data } = require(filePath);
				const { name, description } = data;

				entries.push(`**/${name}** – ${description}`);
			}
		}

		const response = await modify(entries.join('\n'), "response");

		await interaction.reply({
			content: response,
			ephemeral: true
		});
	},
};