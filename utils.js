const { format } = require('date-fns');
const CryptoJS = require("crypto-js");
require('dotenv').config();

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

const encrypt = (message) => {
	const cipherText = CryptoJS.AES.encrypt(message, process.env.CRYPTOJS_TOKEN).toString();
	
	return cipherText;
};

const decrypt = (cipherText) => {
	const bytes = CryptoJS.AES.decrypt(cipherText, process.env.CRYPTOJS_TOKEN);
	const originalText = bytes.toString(CryptoJS.enc.Utf8);

	return originalText;
};

module.exports = { formatDate, fieldsMapToObject, encrypt, decrypt };