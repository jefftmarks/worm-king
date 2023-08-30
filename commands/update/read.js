const Reading = require('../../models/reading');
const User = require('../../models/user');
const Book = require('../../models/book');

const STATMOJIS = {
	unread: { emoji: '🟥', phrase: 'Just read...' },
	started: { emoji: '🟨', phrase: 'Keep up the good work, slug!' },
	finished: { emoji: '🟩', phrase: 'The problem of leadership is inevitably: Who will play God?' } 
};

const {
	SlashCommandBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ComponentType
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('read')
		.setDescription('Update a reading status'),
	async execute(interaction) {
		const user = await User.findOne({ discord_id: interaction.user.id });

		const books = await Book.find().sort({ read_date: 'desc' });

		if (!books) {
			await interaction.reply("ERROR!");
		}

		const bookSelector = new StringSelectMenuBuilder()
			.setCustomId('book')
			.setPlaceholder('Book Title');

		books.forEach((book) => {
			bookSelector.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(book.title)
					.setValue(book.id)
			)
		});

		const bookRow = new ActionRowBuilder()
			.addComponents(bookSelector);

		const statusSelector = new StringSelectMenuBuilder()
			  .setCustomId('status')
				.setPlaceholder(`Update Reading Status`)
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel('unread')
						.setValue('unread'),
					new StringSelectMenuOptionBuilder()
						.setLabel('started')
						.setValue('started'),
					new StringSelectMenuOptionBuilder()
						.setLabel('finished')
						.setValue('finished'),
				);

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
			const selectedBook = books.find((book) => book.id === i.values[0]);

			collector.stop();
			
			const reading = await Reading.findOne({ user: user.id, book: selectedBook.id });
			const currentStatus = reading.status;

			const secondResponse = await i.update({
				content: `**${selectedBook.title}**\n${STATMOJIS[currentStatus].emoji} current reading status: ${currentStatus}`,
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

				reading.status = selectedStatus;
				await reading.save();

				if (!reading) {
					await j.reply("ERROR!");
				}

				await j.update({
					content: `
*🪱 ${STATMOJIS[selectedStatus].phrase}*

**${selectedBook.title}**
${STATMOJIS[selectedStatus].emoji} updated reading status: ${selectedStatus}
					`,
					components: [],
					ephemeral: true
				});
			});
		});
	},
};