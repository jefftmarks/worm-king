const Reading = require('../models/reading');
const User = require('../models/user');

const createReadingsOnBookCreation = async (book) => {
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

		readings.push(reading);
	}

	return readings;
};

module.exports = { createReadingsOnBookCreation };