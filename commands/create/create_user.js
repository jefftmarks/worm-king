require('dotenv').config();
const {
	SlashCommandBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create_user')
		.setDescription('[ADMIN ONLY] Creates new user in database'),
	async execute(interaction) {
		if (interaction.user.id !== process.env.ADMIN_ID) {
			await interaction.reply("PERMISSION DENIED")
		};

		const modal = new ModalBuilder()
			.setCustomId('createUser')
			.setTitle('Create User');

		const usernameInput = new TextInputBuilder()
			.setCustomId('usernameInput')
			.setLabel("Username")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);

		const discordIdInput = new TextInputBuilder()
			.setCustomId('discordIdInput')
			.setLabel("Discord ID")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);
			
		const rowOne = new ActionRowBuilder().addComponents(usernameInput);
		const rowTwo = new ActionRowBuilder().addComponents(discordIdInput);

		modal.addComponents(rowOne, rowTwo);
		
		await interaction.showModal(modal);
	},
};