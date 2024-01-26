const User = require('../../models/user');
const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ComponentType,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('theme')
		.setDescription('Switch block themes'),
	async execute(interaction) {
		const user = await User.findOne({ discord_id: interaction.user.id })
		const isClassic = user.theme === 'classic'

		const themeSelector = new StringSelectMenuBuilder()
		.setCustomId('updateTheme')
		.setPlaceholder(`Update Block Theme`)
		.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel('Classic' + (isClassic ? ' ✅' : ''))
				.setValue('classic')
				.setEmoji('🇬🇳'),
			new StringSelectMenuOptionBuilder()
				.setLabel('Irish' + (!isClassic ? ' ✅' : ''))
				.setValue('irish')
				.setEmoji('🇮🇪')
		);

		const themeRow = new ActionRowBuilder()
			.addComponents(themeSelector);
		
		const response = await interaction.reply({
			content: 'Select your personal block theme',
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
			user.theme = i.values[0]
			await user.save()

			const isClassic = user.theme === 'classic'

			collector.stop();;
			await i.update({
				content: `Your personal block theme has been updated to ${isClassic ? 'Classic' : 'Irish'}`,
				ephemeral: true,
				components: []
			})
		});
	},
};