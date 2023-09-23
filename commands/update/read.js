const Reading = require('../../models/reading');
const User = require('../../models/user');
const buildBookSelector = require('../../components/book-selector');
const buildStatusSelector = require('../../components/status-selector');
const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ComponentType
} = require('discord.js');

const STATMOJIS = {
	unread: { emoji: '🟥', phrase: 'Just read...' },
	started: { emoji: '🟨', phrase: 'Keep up the good work, slug!' },
	finished: { emoji: '🟩', phrase: 'We have that bright Infinity all around us, that Golden Path of forever to which we can continually pledge our puny but inspired allegiance' } 
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('read')
		.setDescription('Update a reading status'),
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

		const statusSelector = buildStatusSelector();

		const statusRow = new ActionRowBuilder()
			.addComponents(statusSelector);
		
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
			const { status, book } = selectedReading;

			collector.stop();;

			const secondResponse = await i.update({
				content: `
					${STATMOJIS[status].emoji} **${book.title}**, status: ${status}
				`,
				components: [statusRow],
				ephemeral: true
			});

			const secondCollector = await secondResponse.createMessageComponentCollector({
				componentType: ComponentType.StringSelect,
				time: 600_000,
				filter: collectorFilter
			})

			secondCollector.on('collect', async j => {
				const selectedStatus = j.values[0];

				secondCollector.stop();

				selectedReading.status = selectedStatus;
				await selectedReading.save();

				if (!selectedReading) {
					await j.reply("ERROR!");
				}

				await j.update({
					content: `
${STATMOJIS[selectedStatus].emoji} **${book.title}**, status: ${selectedStatus} 

*🪱 ${STATMOJIS[selectedStatus].phrase}*
					`,
					components: [],
					ephemeral: true
				});
			});
		});
	},
};