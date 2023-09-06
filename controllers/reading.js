const Reading = require('../models/reading');
const User = require('../models/user');
const Book = require('../models/book');

const createReadingsOnBookCreation = async () => {
	const book = await Book.findById("64f7e4ee7bb8d95e09adf1bc")

	const users = await User.find();

	if (!users) {
		return;
	}

	let readings = [];

	for (const user of users) {
		const reading = await Reading.create({
			book: book.id,
			user: user.id,
			status: 'unread'
		});

		if (!reading) {
			readings = null;
			break;
		}
		
		user.readings.push(reading.id);
		await user.save();

		book.readings.push(reading);
		await book.save();

		readings.push(reading);
	}

	return readings;
};

module.exports = { createReadingsOnBookCreation };