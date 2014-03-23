var q         = require("q");
var request   = require("request");

function Client (server) {
	function performRequest (method, path) {
		var options = {
			json   : true,
			method : method.toUpperCase(),
			url    : server.url(path)
		};

		return q.nfcall(request, options);
	}

	this.get = function (path) {
		return performRequest("get", path);
	};

	this.post = function (path) {
		return performRequest("post", path);
	};
}

function Driver () {
	var server = require("../lib/server");

	this.start = function () {
		return q.ninvoke(server, "start", 0);
	};

	this.stop = function () {
		return q.ninvoke(server, "stop");
	};

	this.client = new Client(server);
}

module.exports = Driver;
