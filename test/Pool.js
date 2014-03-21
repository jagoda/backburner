function Pool (client) {
	this.describe = function () {
		return client.get("/pool");
	};
}

module.exports = Pool;
