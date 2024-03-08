const Reading = require('../models/reading');
const User = require('../models/user');
const Book = require('../models/book');
const { fieldsMapToObject, encrypt, decrypt } = require('../utils/utils');
const { getStatmojis, sortStatmojis } = require('../utils/emojifier');
const book = require('../models/book');

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
			status: 'unread',
			journal: ''
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
	const reading = await Reading.findById(journalObj.reading).populate('book');

	reading.journal = journalObj.entry;
	await reading.save();

	return reading;
};

const printJournal = (reading) => {
	const { book, journal } = reading;

	const formattedEntry = `### ${book.title} by ${book.author}\n>>> ${decrypt(journal)}`

	return formattedEntry
};

const getMyStats = async (user) => {
	const readings = await Reading.find({ user: user.id }).populate('book');

	readings.sort((a, b) => {
		return new Date(a.book.read_date) - new Date(b.book.read_date);
	});

	const entries = [];

	const statmojis = await getStatmojis();

	for (const reading of readings) {
		entries.push(`${statmojis.get(reading.status)} **${reading.book.title}**`)
	}
	
	return entries.join('\n');
};

const getClubStats = async () => {
	const books = await Book.find().sort({ read_date: 'asc' });

	const entries = [];
	const statmojis = await getStatmojis();

	for (const book of books) {
		const stats = [];
		const readings = await Reading.find({ book: book.id });

		for (const reading of readings) {
			stats.push(statmojis.get(reading.status));
		}
		sortedStats = await sortStatmojis(stats);

		entries.push(`
**${book.title}**
${sortedStats.join('')}
		`)
	}

	return entries.join('');
}

const getBookStats = async (bookId) => {
	const readings = await Reading.find({ book: bookId });
	const stats = [];
	const statmojis = await getStatmojis();

	for (const reading of readings) {
		stats.push(statmojis.get(reading.status));
	}
	sortedStats = await sortStatmojis(stats);

	return stats.join('');
};

module.exports = {
	createReadingsOnBookCreation,
	updateJournalEntry,
	printJournal,
	getMyStats,
	getClubStats,
	getBookStats
};