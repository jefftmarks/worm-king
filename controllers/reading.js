const Reading = require('../models/reading');
const User = require('../models/user');
const Book = require('../models/book');

const createReadingsOnCreation = async (item) => {
	const isBook = item.constructor.modelName === "Book";

	const collection = isBook ? await User.find() : await Book.find();

	if (!collection) {
		return;
	}

	let readings = [];

	for (let i = 0; i < collection.length; i++) {
		const reading = await Reading.create({
			book: isBook ? item.id : collection[i].id,
			user: isBook ? collection[i].id : item.id,
			status: 'unread'
		});

		if (!reading) {
			readings = null;
			break;
		}

		current_user = isBook ? collection[i] : item;
		current_user.readings.push(reading.id);
		await current_user.save();

		readings.push(reading);
	}

	return readings;
};

module.exports = { createReadingsOnCreation };