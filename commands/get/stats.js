const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ComponentType
} = require('discord.js');
const User = require('../../models/user');
const buildStatsSelector = require('../../components/stats-selector');
const {
	getMyStats,
	getClubStats,
	getBookStats
} = require('../../controllers/reading');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Returns your personal reading stats'),
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
					statsResponse = await getClubStats();
					break;
				default:
					statsResponse = await getBookStats(statsSelection);
			}

			await i.reply(statsResponse);
		})
	},
};