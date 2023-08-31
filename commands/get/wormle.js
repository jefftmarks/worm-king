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
		.setName('wormle')
		.setDescription('Returns a visual depiction of your stats'),
	async execute(interaction) {
		const user = await User.findOne({ discord_id: interaction.user.id });

		const readings = user.readings

		const payloads = [];

		for (let i = 0; i < readings.length; i++) {
			const reading = await Reading.findById(readings[i]);
			const status = reading.status;
			const book = await Book.findById(reading.book);

			const payload = {
				date: book.read_date,
				status: STATMOJIS[status]
			}

			payloads.push(payload);
		}

		const entries = [];

		payloads.sort((a, b) => {
			return new Date(a.date) - new Date(b.date);
		})
			.forEach((payload) => {
				entries.push(payload.status);
			})

		await interaction.reply(entries.join(''));
	},
};