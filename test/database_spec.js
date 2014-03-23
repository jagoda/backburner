var Configuration = require("../lib/Configuration");
var Database      = require("../lib/Database");
var expect        = require("chai").expect;
var mongo         = require("mongoskin");
var q             = require("q");
var uuid          = require("node-uuid");

describe("A database", function () {
	var configuration;
	var database;

	function dropCollection (name) {
		var deferred = q.defer();

		mongo.db(configuration.databaseUrl).collection(name).drop(deferred.makeNodeResolver());
		return deferred.promise;
	}

	before(function () {
		configuration = new Configuration();
		database      = new Database(configuration.databaseUrl);
	});

	describe("that creates a new instance record", function () {
		var instanceId = uuid.v4();
		var instance;

		before(function (done) {
			database.instances.create({
				id : instanceId
			})
			.then(function (response) {
				instance = response;
			})
			.nodeify(done);
		});

		after(function (done) {
			dropCollection("instances").nodeify(done);
		});

		it("creates a new database entry", function (done) {
			var deferred = q.defer();

			mongo.db(configuration.databaseUrl).collection("instances").find().toArray(deferred.makeNodeResolver());

			deferred.promise.then(function (results) {
				expect(results, "wrong number of results").to.have.length(1);
				expect(results[0], "wrong instance").to.have.property("id", instanceId);
				expect(results[0], "no database id").to.have.property("_id");
			})
			.nodeify(done);
		});

		it("returns the new instance ID", function () {
			expect(instance).to.have.property("id", instanceId);
		});

		it("does not return the database ID", function () {
			expect(instance).not.to.have.property("_id");
		});
	});
});
