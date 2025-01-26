const Reading = require('../models/reading');
const User = require('../models/user');
const Book = require('../models/book');
const Stat = require('../models/stat');
const Theme = require('../models/theme');
const { fieldsMapToObject, encrypt, decrypt } = require('../utils/utils');
const { getStatmojis, sortStatmojis, modify } = require('../utils/themeHelper');

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
	const theme = await Theme.findOne({ current: true });

	for (const reading of readings) {
		const statmoji = statmojis.get(reading.status);
		const modifiedStatmoji = await modify(statmoji, "statmoji", theme);
		entries.push(`${modifiedStatmoji} **${reading.book.title}**`)
	}
	
	return entries.join('\n');
};

const refreshClubStatsCache = async () => {
	const books = await Book.find().sort({ read_date: 'asc' });

	const entries = [];
	const statmojis = await getStatmojis();
	const theme = await Theme.findOne({ current: true });

	for (const book of books) {
		const stats = [];
		const readings = await Reading.find({ book: book.id });

		for (const reading of readings) {
			const statmoji = statmojis.get(reading.status);
			const modifiedStatmoji = await modify(statmoji, "statmoji", theme);
			stats.push(modifiedStatmoji);
		}
		sortedStats =  await sortStatmojis(stats, theme);

		entries.push(`**${book.title}**\n${sortedStats.join('')}`)
	}

	await Stat.findOneAndUpdate({ name: 'club' }, { cache: entries.join('\n') });
}

const getBookStats = async (bookId) => {
	const readings = await Reading.find({ book: bookId });
	const book = await Book.findById(bookId);
	const stats = [];
	const statmojis = await getStatmojis();
	const theme = await Theme.findOne({ current: true });

	for (const reading of readings) {
		const statmoji = statmojis.get(reading.status);
		const modifiedStatmoji = await modify(statmoji, "statmoji", theme);
		stats.push(modifiedStatmoji);
	}
	sortedStats = await sortStatmojis(stats, theme);

	return `
**${book.title}**
${stats.join('')}
	`
};

module.exports = {
	createReadingsOnBookCreation,
	updateJournalEntry,
	printJournal,
	getMyStats,
	refreshClubStatsCache,
	getBookStats
};