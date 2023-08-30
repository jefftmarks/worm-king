const { format } = require('date-fns')

const formatDate = (date) => {
	const [year, month] = date.split('-');
	return format(new Date(year, month - 1), 'MMMM yyyy');
};

module.exports = { formatDate };