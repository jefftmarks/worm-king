const Discord = require("discord.js");
const { token } = require("./config.json");

const Client = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.DirectMessages,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.Guilds
	],
	partials: [
		Discord.Partials.Message,
		Discord.Partials.Channel,
		Discord.Partials.GuildMember,
		Discord.Partials.User,
		Discord.Partials.GuildScheduledEvent
	]
});

Client.on("ready", (client) => {
	 console.log("This bot is now online: " + client.user.tag);
});

Client.on("messageCreate", (message) => {
	const { author, content, guild } = message;

	if (author.bot) return;

	const userInput = content.toLowerCase();

	console.log(`A new messaege was written by ${author.username}`);
	// message.reply("Hello world! You're not a bot!");

	if (["!commands", "!help"].includes(userInput)) {
		message.reply(
			"This bot operates on the following commands:\n•\t!help\n•\t!commands\n•\t!age\n•\t!math"
		)
	}

	if (userInput === "!math") {
		message.reply("1 + 1 = " + (1 + 1));
	}

	if (userInput === "!age") {
		const serverCreationDate = guild.createdAt.toDateString();

		guild.members.fetch(author.id)
			.then((value) => {
				const userJoinDate = new Date(value.joinedTimestamp).toDateString();

				message.reply(
					`Server was created: ${serverCreationDate}\n` + 
					`User ${author.username} joined ${userJoinDate}`
				);
			})
			.catch((error) => console.log(error));
	}
});

Client.login(token);