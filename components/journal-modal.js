const {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require('discord.js');
const { decrypt } = require('../utils/utils');

const buildJournalModal = (reading) => {
	const modal = new ModalBuilder()
		.setCustomId('updateJournal')
		.setTitle(reading.book.title);

	const journalInput = new TextInputBuilder()
		.setCustomId(reading.id)
		.setLabel("Keep track of your notes here:")
		.setStyle(TextInputStyle.Paragraph)
		.setValue(decrypt(reading.journal))
		.setRequired(false)

	const row = new ActionRowBuilder().addComponents(journalInput);

	modal.addComponents(row);

	return modal;
};

module.exports = buildJournalModal;