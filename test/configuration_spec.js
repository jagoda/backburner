var Configuration = require("../lib/Configuration");
var expect        = require("chai").expect;
var utilities     = require("./helpers/utilities");

var _ = require("lodash");

describe("A configuration", function () {
	describe("using default values", function () {
		var configuration;
		var restoreEnvironment;

		before(function () {
			restoreEnvironment = utilities.clearEnvironment();
			configuration = new Configuration();
		});

		after(function () {
			restoreEnvironment();
		});

		it("has read-only properties", function () {
			expect(_.size(configuration), "no configuration properties").to.be.greaterThan(0);

			_.forEach(configuration, function (value, key) {
				delete configuration[key];
				expect(configuration[key], "modified " + key).to.equal(value);
			});
		});

		it("returns 'mongodb://localhost:27017/backburner' for the database URL", function () {
			expect(configuration.databaseUrl, "wrong URL").to.equal("mongodb://localhost:27017/backburner");
		});
	});

	describe("with the DATABASE_URL environment variable defined", function () {
		var configuration;
		var restoreUrl;

		before(function () {
			restoreUrl    = utilities.setEnvironmentVariable("DATABASE_URL", "mongodb://example.com:27017/test");
			configuration = new Configuration();
		});

		after(function () {
			restoreUrl();
		});

		it("returns the DATABASE_URL value for the database URL", function () {
			expect(configuration.databaseUrl, "wrong URL").to.equal("mongodb://example.com:27017/test");
		});
	});
});
