const Reading = require('../../models/reading');
const User = require('../../models/user');
const buildBookSelector = require('../../components/book-selector');
const buildJournalModal = require('../../components/journal-modal');
const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ComponentType
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('journal')
		.setDescription('Update your journal entry for a book'),
	async execute(interaction) {
		const user = await User.findOne({ discord_id: interaction.user.id })

		const readings = await Reading.find({ user: user.id }).populate('book');

		if (!readings) {
			await interaction.reply("ERROR!");
		}

		readings.sort((a, b) => {
			return new Date(b.book.read_date) - new Date(a.book.read_date);
		});

		const bookSelector = buildBookSelector(readings);

		const bookRow = new ActionRowBuilder()
			.addComponents(bookSelector);
		
		const response = await interaction.reply({
			content: '🪱 *Select a book, worm!*',
			components: [bookRow],
			ephemeral: true
		});

		const collectorFilter = i => i.user.id === interaction.user.id;

		const collector = await response.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 600_000,
			filter: collectorFilter
		});

		collector.on('collect', async i => {
			const selectedReading = readings.find((r) => r.book.id === i.values[0]);

			collector.stop();

			const modal = buildJournalModal(selectedReading);

			await i.showModal(modal);
			await interaction.deleteReply();
		});
	},
};