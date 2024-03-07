const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Theme = require('../models/theme');

const buildThemeSelector = async () => {
	const themes = await Theme.find();

	selector = new StringSelectMenuBuilder()
		.setCustomId('updateTheme')
		.setPlaceholder(`Update Theme`)

	themes.forEach((theme) => {
		selector.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel(theme.name + (theme.current ? ' ✅' : ''))
				.setValue(theme.name)
				.setEmoji(theme.icon)
		)
	});

	return selector;
};

module.exports = buildThemeSelector