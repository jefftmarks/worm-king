const Client = require('./discord/client');
require('./discord/commands');

const connectDB = require('./db/connect');

require('dotenv').config();

Client.on("ready", async (client) => {
	try {
		connectDB(process.env.MONGO_URI);
		console.log("Worm king is now online: " + client.user.tag);
	} catch (error) {
		console.log(error);
	}
});

Client.login(process.env.DISCORD_TOKEN);