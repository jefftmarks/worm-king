const Book = require('../models/book');
const { fieldsMapToObject } = require('../utils');
const { createReadingsOnBookCreation } = require('../controllers/reading');

const createBook = async (fields) => {
	const fieldsObj = fieldsMapToObject(fields);
	const {
		titleInput,
		authorInput,
		pickedByInput,
		monthInput,
	} = fieldsObj;

	const mostRecentBook = await Book.findOne({ current: true});

	if (mostRecentBook) {
		mostRecentBook.current = false;
		mostRecentBook.save();
	}

	const book = await Book.create({
		title: titleInput,
		author: authorInput,
		picked_by: pickedByInput,
		read_date: monthInput,
		current: true
	});

	if (!book) {
		return;
	}

	const readings = await createReadingsOnBookCreation(book);

	if (!readings) {
		return;
	}

	return book;
};

module.exports = { createBook };