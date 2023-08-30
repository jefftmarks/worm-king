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
		.setName('create_book')
		.setDescription('[ADMIN ONLY] Creates new book in database'),
	async execute(interaction) {
		if (interaction.user.id !== process.env.ADMIN_ID) {
			await interaction.reply("PERMISSION DENIED")
		};

		const modal = new ModalBuilder()
			.setCustomId('createBook')
			.setTitle('Create Book');

		const titleInput = new TextInputBuilder()
			.setCustomId('titleInput')
			.setLabel("Title")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);

		const authorInput = new TextInputBuilder()
			.setCustomId('authorInput')
			.setLabel("Author")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);

		const pickedByInput = new TextInputBuilder()
			.setCustomId('pickedByInput')
			.setLabel("Picked By ID")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);

		const monthInput = new TextInputBuilder()
			.setCustomId('monthInput')
			.setLabel("Month")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);
			
		const rowOne = new ActionRowBuilder().addComponents(titleInput);
		const rowTwo = new ActionRowBuilder().addComponents(authorInput);
		const rowThree = new ActionRowBuilder().addComponents(pickedByInput);
		const rowFour = new ActionRowBuilder().addComponents(monthInput);

		modal.addComponents(rowOne, rowTwo, rowThree, rowFour);
		
		await interaction.showModal(modal);
	},
};