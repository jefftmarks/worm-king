const { SlashCommandBuilder } = require('discord.js');
const Book = require('../../models/book');
const User = require('../../models/user');
const Reading = require('../../models/reading');

const STATMOJIS = {
	unread: '🟥', 
	started: '🟨', 
	finished: '🟩',
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('Returns reading record for all books'),
	async execute(interaction) {
		const books = await Book.find().sort({ read_date: 'asc' });

		const entries = [];

		for (let i = 0; i < books.length; i++) {
			const book = books[i];
			const readings = book.readings;

			const emojis = [];

			for (let j = 0; j < readings.length; j++) {
				const reading = await Reading.findById(readings[j]);
				const status = reading.status;
				emojis.push(STATMOJIS[status]);
			}

			emojis.sort((a, b) => {
				if (a === b) {
					return 0;
				} else if (a === '🟩') {
					return -1;
				} else if (a === '🟨' && b !== '🟩') {
					return -1;
				} else if (a === '🟥') {
					return 1;
				} else {
					return 1;
				}
			});

			entries.push(`
**${book.title}**
${emojis.join('')}
			`)
		}

		await interaction.reply(entries.join(''));
	},
};