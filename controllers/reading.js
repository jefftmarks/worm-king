const Reading = require('../models/reading');
const User = require('../models/user');
const { fieldsMapToObject, encrypt } = require('../utils');

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

const encryptedJournalObjectFromFields = async (map) => {
	const obj = fieldsMapToObject(map);
	
	let journalObj = {
		reading: null,
		entry: null
	};

	for (const key in obj) {
		journalObj.reading = key;
		journalObj.entry = encrypt(obj[key]);
	}

	return journalObj;
};

const updateJournalEntry = async (fields) => {
	const journalObj = await encryptedJournalObjectFromFields(fields);
	const reading = await Reading.findById(journalObj.reading);

	reading.journal = journalObj.entry;
	await reading.save();

	return reading;
};

module.exports = { createReadingsOnBookCreation, updateJournalEntry };