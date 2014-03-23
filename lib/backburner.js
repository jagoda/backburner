var express  = require("express");
var uuid     = require("node-uuid");

module.exports = function () {
	var backburner = express();

	backburner.use(express.json());

	// Describe the instance pool status.
	backburner.get("/pool", function (request, response) {
		var pool = {
			available : 0,
			buffer    : 2
		};

		response.json(200, pool);
	});

	// Request a new instance from the pool.
	backburner.post("/pool/instances", function (request, response) {
		var id = uuid.v4();

		var instance = {
			id  : id,
			url : "http://localhost:12345/pool/instances/" + id
		};

		response.json(202, instance);
	});

	return backburner;
};
