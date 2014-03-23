var _ = require("lodash");

module.exports = {

	clearEnvironment : function () {
		var restoreEnvironment = this.saveEnvironment();

		_.forEach(process.env, function (value, key) {
			delete process.env[key];
		});

		return restoreEnvironment;
	},

	expectFailure : function () {
		throw new Error("Should not succeed.");
	},

	saveEnvironment : function () {
		var environment = _.clone(process.env);

		return function () {
			var newKeys = _.difference(_.keys(process.env), _.keys(environment));

			_.forEach(newKeys, function (key) {
				delete process.env[key];
			});
			_.forEach(environment, function (value, key) {
				process.env[key] = value;
			});
		};
	},

	setEnvironmentVariable : function (name, value) {
		var originalValue = process.env[name];

		process.env[name] = value;
		return function () {
			if (typeof originalValue === "undefined") {
				delete process.env[name];
			}
			else {
				process.env[name] = originalValue;
			}
		};
	}

};
