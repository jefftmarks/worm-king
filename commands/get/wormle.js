const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/user');
const Reading = require('../../models/reading');
const Theme = require('../../models/theme');
const { getStatmojis, modify } = require('../../utils/themeHelper');

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
		const statmojis = await getStatmojis();
		const theme = await Theme.findOne({ current: true });

		for (const reading of readings) {
			const statmoji = statmojis.get(reading.status);
			const modifiedStatmoji = await modify(statmoji, "statmoji", theme);
			entries.push(modifiedStatmoji);
		}

		const wormle = entries.join('');

		const response = await modify(wormle, "response");

		await interaction.reply(response);
	},
};