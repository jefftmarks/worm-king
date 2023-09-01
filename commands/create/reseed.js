const Reading = require('../../models/reading');
const User = require('../../models/user');
const Book = require('../../models/book');

require('dotenv').config();
const {
	SlashCommandBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reseed')
		.setDescription('[ADMIN ONLY] Creates new user in database'),
	async execute(interaction) {
		const books = await Book.find();
		const users = await User.find();
	
		for (let i = 0; i < books.length; i++) {
			for (let j = 0; j < users.length; j++) {
				const book = books[i];
				const user = users[j];

				const skip = (["edlord", "orchid_house"].includes(user.username) && i < 4);

				if (!skip) {	
					const reading = await Reading.create({
						book: book.id,
						user: user.id,
						status: 'unread'
					});

					book.readings.push(reading);
					await book.save();

					user.readings.push(reading);
					await user.save();
				}
			}
		}

		interaction.reply("HI");
	},
};