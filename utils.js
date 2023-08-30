const { format } = require('date-fns')

const formatDate = (date) => {
	const [year, month] = date.split('-');
	return format(new Date(year, month - 1), 'MMMM yyyy');
};

// const getUserByDiscordId = async (members, discordId) => {
// 	const user = await members.fetch(discordId);
// 	console.log(user);
// 	return { username: "jeff" };
// };

module.exports = { formatDate };