const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ComponentType
} = require('discord.js');
const User = require('../../models/user');
const Stat = require('../../models/stat');
const buildStatsSelector = require('../../components/stats-selector');
const {
	getMyStats,
	refreshClubStatsCache,
	getBookStats
} = require('../../controllers/reading');
const { modifyResponse } = require('../../utils/themeHelper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Returns reading stats for yourself, the entire club, or a specific book'),
	async execute(interaction) {
		const user = await User.findOne({ discord_id: interaction.user.id });
		const statsSelector = await buildStatsSelector();

		const statsRow = new ActionRowBuilder()
			.addComponents(statsSelector);

		const response = await interaction.reply({
			content: '🪱 *Select your stats, worm!*',
			components: [statsRow],
			ephemeral: true
		});

		const collectorFilter = i => i.user.id === interaction.user.id;

		const collector = await response.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 600_000,
			filter: collectorFilter
		});

		collector.on('collect', async i => {
			const statsSelection = i.values[0];
			
			collector.stop();

			let statsResponse;

			switch(statsSelection) {
				case 'myStats':
					statsResponse = await getMyStats(user);
					break;
				case 'clubStats':
					 const stat = await Stat.findOne({ name: 'club' })
					 statsResponse = stat.cache
					break;
				default:
					statsResponse = await getBookStats(statsSelection);
			}

			const response = await modifyResponse(statsResponse);

			await i.update({ components: []})
			await i.followUp(response);
		});
	},
};