const { SlashCommandBuilder } = require('discord.js');
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

		const readings = await Reading.find({ user: user.id }).populate('book');;

		readings.sort((a, b) => {
			return new Date(a.book.read_date) - new Date(b.book.read_date);
		});

		const entries = [];

		for (const reading of readings) {
			entries.push(STATMOJIS[reading.status]);
		}

		await interaction.reply(entries.join(''));
	},
};