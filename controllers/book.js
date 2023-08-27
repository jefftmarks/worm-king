const Book = require('../models/book');

const createBook = async () => {
	const book = await Book.create({
		title: "Open",
		author: "Andre Agassi",
		picked_by: "64eaa3beeacc81d043cd4f3f"
	});

	if (book) {
		book.save();
	}

	return book;
};

module.exports = { createBook };