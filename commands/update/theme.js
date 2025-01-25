const User = require('../../models/user');
const Theme = require('../../models/theme');
const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ComponentType
} = require('discord.js');
const buildThemeSelector = require('../../components/theme-selector');
const { updateUsernames } = require('../../controllers/user')
const { modifyResponse } = require('../../utils/themeHelper');
const { refreshClubStatsCache } = require('../../controllers/reading');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('theme')
		.setDescription('Switch block themes'),
	async execute(interaction) {
		updateUsernames(interaction);
		const user = await User.findOne({ discord_id: interaction.user.id })
		const themeSelector = await buildThemeSelector();
		const themeRow = new ActionRowBuilder()
			.addComponents(themeSelector);
		
		const response = await interaction.reply({
			content: 'Select a theme',
			components: [themeRow],
			ephemeral: true
		});

		const collectorFilter = i => i.user.id === interaction.user.id;

		const collector = await response.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 600_000,
			filter: collectorFilter
		});

		collector.on('collect', async i => {			
			oldTheme = await Theme.findOneAndUpdate({ current: true}, { current: false});
			newTheme = await Theme.findOneAndUpdate({ name: i.values[0]}, { current: true });
			themeName = newTheme.name[0].toUpperCase() + newTheme.name.slice(1);

			const response = await modifyResponse(
				`${user.username} updated the theme to ${themeName} ${newTheme.icon}`
			);

			collector.stop();;
			await i.update({
				content: response,
				components: []
			});

			await refreshClubStatsCache();
		});
	},
};