const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/user');
const Reading = require('../../models/reading');
const { getStatmojis } = require('../../utils/emojifier')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Returns your personal reading stats'),
	async execute(interaction) {
		const user = await User.findOne({ discord_id: interaction.user.id });

		const readings = await Reading.find({ user: user.id }).populate('book');

		readings.sort((a, b) => {
			return new Date(a.book.read_date) - new Date(b.book.read_date);
		});

		const entries = [];

		const statmojis = await getStatmojis();

		for (const reading of readings) {
			entries.push(`${statmojis.get(reading.status)} **${reading.book.title}**`)
		}
		
		await interaction.reply(entries.join('\n'));
	},
};