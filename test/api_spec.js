var Driver = require("./Driver");
var expect = require("chai").expect;

describe("The REST API", function () {

	var driver = new Driver();

	before(function (done) {
		driver.start().nodeify(done);
	});

	after(function (done) {
		driver.stop().nodeify(done);
	});

	it("can describe the instance pool", function (done) {
		driver.pool.describe()
			.spread(function (response, body) {
				expect(response.statusCode, "status code").to.equal(200);
				expect(body).to.have.property("capacity", 5);
				expect(body).to.have.property("available", 0);
			})
			.nodeify(done);
	});

});
