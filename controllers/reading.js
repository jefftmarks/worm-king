const Reading = require('../models/reading');
const User = require('../models/user');
const Book = require('../models/book');

const createReadingsOnBookCreation = async (book) => {
	const users = await User.find();

	if (!users) {
		return;
	}

	let readings = [];

	for (let i = 0; i < users.length; i++) {
		const user = users[i];

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

		readings.push(reading);
	}

	return readings;
};

module.exports = { createReadingsOnBookCreation };