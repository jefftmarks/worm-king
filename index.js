require('dotenv').config();
const connectDB = require('./db/connect');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { createBook } = require('./controllers/book');
const { createUser } = require('./controllers/user');
const { updateJournalEntry, printJournal } = require('./controllers/reading');
const User = require('./models/user');
const { modifyResponse } = require('./utils/themeHelper');
 
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	const users = await User.find();
	const ids = users.map((user) => user.discord_id);

	if (!ids.includes(interaction.user.id)) {
		interaction.reply("READ OR GTFO!");
		return;
	}

	if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
	
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	} else if (interaction.isModalSubmit()) {
			switch(interaction.customId) {
				case "createBook":
					const book = await createBook(interaction.fields.fields);

					if (!book) {
						await interaction.reply({ content: 'ERROR!'});
					}

					const bookResponse = await modifyResponse(`**${book.title}** successfully created!`);

					await interaction.reply({ content: bookResponse});
					break;
				case "createUser":
					const user = await createUser(interaction.fields.fields);

					if (!user) {
						await interaction.reply({ content: 'ERROR!'});
					}

					const userResponse = await modifyResponse(`**${user.username}** successfully created!`);

					await interaction.reply({ content: userResponse });
					break;
				case "updateJournal":
					const reading = await updateJournalEntry(interaction.fields.fields);

					const journalResponse = await modifyResponse(printJournal(reading));

					if (!reading) {
						await interaction.reply({ content: 'ERROR!'});
					}

					await interaction.reply({ content: journalResponse, ephemeral: true });
					break;
				default:
					interaction.reply("ERROR!");
			}
	}
});

client.once(Events.ClientReady, async c => {
	await connectDB(process.env.MONGO_URI);
	
	console.log('Worm king is now online: ' + c.user.tag);
});

client.login(process.env.DISCORD_TOKEN);