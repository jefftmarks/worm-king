module.exports = MODIFIERS = {
	void: {
		response: (response) => {
			return response.replaceAll(/([eèéêëēėęEÈÉÊËĒĖĘ])/g, "||$1||");
		}
	},
	uncertaintyPrinciple: {
		statmoji: (statmoji) => {
			const mirror = {
				'🟥': Math.random() < 0.5 ? '⏰' : '🏓',
				'🟨': Math.random() < 0.5 ? '🍋' : '🧀',
				'🟩': Math.random() < 0.5 ? '🐸' : '🧩'
			}

			return Math.random() < 0.05 ? mirror[statmoji] : statmoji;
		},
		rankMap: {
			'⏰': 0,
			'🏓': 0,
			'🍋': 1,
			'🧀': 1,
			'🐸': 2,
			'🧩': 2
		}
	}
};