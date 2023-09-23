const Reading = require('../models/reading');
const User = require('../models/user');
const { fieldsMapToObject } = require('../utils');

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

		readings.push(reading);
	}

	return readings;
};

const updateJournalEntry = async (fields) => {
	const responseObj = fieldsMapToObject(fields);

	let reading = null;

	for (const key in responseObj) {
		reading = await Reading.findById(key);
		reading.journal = responseObj[key];
		await reading.save();
	}

	return reading;
};

module.exports = { createReadingsOnBookCreation, updateJournalEntry };