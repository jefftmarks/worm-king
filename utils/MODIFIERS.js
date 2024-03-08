module.exports = MODIFIERS = {
	void: (response) => {
		return response.replaceAll(/([eèéêëēėęEÈÉÊËĒĖĘ])/g, "||$1||");
	}
};