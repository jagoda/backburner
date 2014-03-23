var Driver = require("./helpers/Driver");
var expect = require("chai").expect;
var q      = require("q");

var _ = require("lodash");

describe("The REST API", function () {
	var driver = new Driver();

	before(function (done) {
		driver.start().nodeify(done);
	});

	after(function (done) {
		driver.stop().nodeify(done);
	});

	describe("GET /pool method", function () {
		var pool;
		var statusCode;

		before(function (done) {
			driver.client.get("/pool")
			.spread(function (response, body) {
				statusCode = response.statusCode;
				pool       = body;
			})
			.nodeify(done);
		});

		it("responds with code 200", function () {
			expect(statusCode, "wrong status code").to.equal(200);
		});

		it("reports the number of instances currently available", function () {
			expect(pool).to.have.property("available", 0);
		});

		it("reports the maximum number of pre-built instances", function () {
			expect(pool).to.have.property("buffer", 2);
		});
	});

	describe("POST /pool/instances method", function () {
		var bodies;
		var responses;

		before(function (done) {
			// Create two new instances in parallel.
			q.all([
				driver.client.post("/pool/instances"),
				driver.client.post("/pool/instances")
			])
			.then(function (results) {
				// Regroup results by columns.
				var columns = _.zip.apply(_, results);

				responses = columns[0];
				bodies    = columns[1];
			})
			.nodeify(done);
		});

		it("responds with code 202", function () {
			_.forEach(responses, function (response) {
				expect(response.statusCode, "wrong status code").to.equal(202);
			});
		});

		it("responds with a pointer to the new instance resource", function () {
			var pattern = /http:\/\/localhost:\d{1,5}\/pool\/instances\/[^\/]+/;

			_.forEach(bodies, function (body) {
				expect(body).to.have.property("id");
				expect(body.url, "bad instance URL").to.match(pattern);
			});
		});

		it("generates a unique ID for each instance", function () {
			var ids = _.uniq(_.pluck(bodies, "id"));

			expect(ids, "duplicate IDs").to.have.length(responses.length);
			_.forEach(ids, function (id) {
				expect(id, "bad ID").to.have.length.greaterThan(0);
			});
		});

		it("generates a URL for each instance", function () {
			_.forEach(bodies, function (instance) {
				expect(instance.url, "URL does not end with ID").to.match(new RegExp("/" + instance.id + "$"));
			});
		});
	});
});
