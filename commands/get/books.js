const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');
const { formatDate } = require('../../utils/utils');
const { updateUsernames } = require('../../controllers/user');
const { getBookmoji, modify } = require('../../utils/themeHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('books')
		.setDescription('Returns list of book club books'),
	async execute(interaction) {
		const books = await Book.find()
			.populate('picked_by')
			.sort({ read_date: 'asc' });

		if (!books) {
			await interaction.reply("ERROR!");
		}

		updateUsernames(interaction);

		const entries = [];

		for (let i = 0; i < books.length; i++) {
			const {
				title,
				author,
				picked_by,
				read_date,
				current
			} = books[i];
	
			entries.push(`
🪱${getBookmoji(i, current)}  **${title}**
              by ${author}
              picked by ${picked_by.username} (${formatDate(read_date)})
			`);
		}

		const response = await modify(entries.join(''), "response");

		await interaction.reply(response);
	},
};