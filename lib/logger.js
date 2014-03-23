var Console = require("winston").transports.Console;
var Logger  = require("winston").Logger;

module.exports = function () {

	var logger = new Logger();

	if (process.env.NODE_ENV !== "test" || process.env.ENABLE_LOGGING === "true") {
		logger.add(Console, { colorize : true });
	}

	return logger;

};
