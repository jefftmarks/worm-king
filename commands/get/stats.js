const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/user');

const STATMOJIS = {
	unread: '🟥', 
	started: '🟨', 
	finished: '🟩',
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Returns your personal reading stats'),
	async execute(interaction) {
		const user = await User
			.findOne({ discord_id: interaction.user.id })
			.populate('readings');

		const readings = user.readings

		for (const reading of readings) {
			await reading.populate('book');
		}

		readings.sort((a, b) => {
			return new Date(a.book.read_date) - new Date(b.book.read_date);
		});

		const entries = [];

		for (const reading of readings) {
			entries.push(`${STATMOJIS[reading.status]} **${reading.book.title}**`)
		}
		
		await interaction.reply(entries.join('\n'));
	},
};