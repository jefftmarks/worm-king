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
		.setName('create_theme')
		.setDescription('[ADMIN ONLY] Creates new theme in database'),
	async execute(interaction) {
		if (interaction.user.id !== process.env.ADMIN_ID) {
			await interaction.reply("PERMISSION DENIED")
		};

		const modal = new ModalBuilder()
			.setCustomId('createTheme')
			.setTitle('Create Theme');

		const nameInput = new TextInputBuilder()
			.setCustomId('nameInput')
			.setLabel("Theme Name")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);

		const unreadEmoji = new TextInputBuilder()
			.setCustomId('unreadEmoji')
			.setLabel("Unread")
			.setValue('🟥')
			.setRequired(true)
			.setStyle(TextInputStyle.Short);
		
		const startedEmoji = new TextInputBuilder()
			.setCustomId('startedEmoji')
			.setLabel("Started")
			.setValue('🟨')
			.setRequired(true)
			.setStyle(TextInputStyle.Short);

		const finishedEmoji = new TextInputBuilder()
			.setCustomId('finishedEmoji')
			.setLabel("Finished")
			.setValue('🟩')
			.setRequired(true)
			.setStyle(TextInputStyle.Short);

		const themeIcon = new TextInputBuilder()
			.setCustomId('themeIcon')
			.setLabel("Theme Icon")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);
			
		const rowOne = new ActionRowBuilder().addComponents(nameInput);
		const rowTwo = new ActionRowBuilder().addComponents(unreadEmoji);
		const rowThree = new ActionRowBuilder().addComponents(startedEmoji);
		const rowFour = new ActionRowBuilder().addComponents(finishedEmoji);
		const rowFive = new ActionRowBuilder().addComponents(themeIcon);

		modal.addComponents(rowOne, rowTwo, rowThree, rowFour, rowFive);
		
		await interaction.showModal(modal);
	},
};