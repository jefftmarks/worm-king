const Client = require('./client');
const { createBook } = require('../controllers/book');
const { ModalBuilder } = require('discord.js');

const onMessageCreate = Client.on("messageCreate", async (message) => {
 const { author, content, guild } = message;

 if (author.bot) return;

 if (content === "!read") {
	const modal = new ModalBuilder()
		.setCustomId("readModal");
		.setTitle("My Modal");
 }

//  const userInput = content.toLowerCase();

//  console.log(`A new message was written by ${author.username}`);
//  // message.reply("Hello world! You're not a bot!");

//  if (["!commands", "!help"].includes(userInput)) {
// 	 message.reply(
// 		 "This bot operates on the following commands:\n•\t!help\n•\t!commands\n•\t!age\n•\t!math"
// 	 )
//  }

//  if (userInput === "!math") {
// 	 message.reply("1 + 1 = " + (1 + 1));
//  }

//  if (userInput === "!age") {
// 	 const serverCreationDate = guild.createdAt.toDateString();

// 	 guild.members.fetch(author.id)
// 		 .then((value) => {
// 			 const userJoinDate = new Date(value.joinedTimestamp).toDateString();

// 			 message.reply(
// 				 `Server was created: ${serverCreationDate}\n` + 
// 				 `User ${author.username} joined ${userJoinDate}`
// 			 );
// 		 })
// 		 .catch((error) => console.log(error));
//  }
});

module.exports = onMessageCreate;