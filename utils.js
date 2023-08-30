const { format } = require('date-fns')

const formatDate = (date) => {
	const [year, month] = date.split('-');
	return format(new Date(year, month - 1), 'MMMM yyyy');
};

const fieldsMapToObject = (map) => {
	const obj = Object.fromEntries(map.entries());
	for (const key in obj) {
		obj[key] = obj[key].value;
	}
	return obj;
};

module.exports = { formatDate, fieldsMapToObject };