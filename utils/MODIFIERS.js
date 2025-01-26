module.exports = MODIFIERS = {
	void: {
		response: (response) => {
			return response.replaceAll(/([eèéêëēėęEÈÉÊËĒĖĘ])/g, "||$1||");
		}
	},
	uncertaintyPrinciple: {
		statmoji: (statmoji) => {
			const mirror = {
				'🟥': '⏰',
				'🟨': '🍋',
				'🟩': '🐸'
			}

			return Math.floor(Math.random() * 100) === 50 ? mirror[statmoji] : statmoji;
		},
		rankMap: {
			'⏰': 0,
			'🍋': 1,
			'🐸': 2
		}
	}
};