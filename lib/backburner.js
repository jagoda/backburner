var express  = require("express");

module.exports = function () {
	var backburner = express();

	backburner.use(express.json());

	backburner.get("/pool", function (request, response) {
		var pool = {
			available : 0,
			capacity  : 5
		};

		response.json(200, pool);
	});

	return backburner;
};
