require('dotenv').config();
const connectDB = require('../../db/connect');
const Book = require('../../models/book');
const Reading = require('../../models/reading');
const User = require('../../models/user');

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
		const db = await connectDB(process.env.MONGO_URI);

		if (!db) {
			await interaction.reply("ERROR!");
		}

		const books = await Book.find().sort({ read_date: 'desc' });

		if (!books) {
			await interaction.reply("ERROR!");
		}

		const { user } = interaction

		const bookSelect = new StringSelectMenuBuilder()
		.setCustomId('book')
		.setPlaceholder('Book Title');

		books.forEach((book) => {
			bookSelect.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(book.title)
					.setValue(book.id)
			)
		});

		const statusSelect = new StringSelectMenuBuilder()
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
			
		const firstRow = new ActionRowBuilder().addComponents(bookSelect);
		const secondRow = new ActionRowBuilder().addComponents(statusSelect);

		const response = await interaction.reply({
			content: 'Select a book, worm!',
			components: [firstRow, secondRow]
		});

		const collectorFilter = i => i.user.id === interaction.user.id;

		const collector = response.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			filter: collectorFilter,
			time: 3_600_000
		})

		collector.on('collect', async i => {
			console.log(i.values)
			// const bookId = i.values[0];
			// const dbUser = await User.findOne({ discord_id: user.id });
			
			// const query = {
			// 	user: dbUser.id,
			// 	book: bookId 
			// };

			// const reading = await Reading.findOneAndUpdate(query, query, { upsert: true });
				
			// if (!reading) {
			// 	await i.reply("ERROR!");
			// }
			
			// const { status } = reading;

// 			const wormResponse = `
// ${STATMOJIS[status].emoji} Status: ${status}

// 🪱 *${STATMOJIS[status].phrase}*
// 			`;
			// const statusResponse = await i.reply({
			// 	content: wormResponse,
			// 	components: [secondRow]
			// });

			// try {
			// 	const statusCollector = await statusResponse.createMessageComponentCollector({
			// 		componentType: ComponentType.StringSelect,
			// 		filter: collectorFilter,
			// 		time: 600_000
			// 	});

			// 	statusCollector.on('collect', async j => {
			// 		console.log(j.values);
			// 	});
			// } catch (error) {
			// 		await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
			// }
		});
	},
};