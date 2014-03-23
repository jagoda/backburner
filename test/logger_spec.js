var createLogger = require("../lib/logger");
var expect       = require("chai").expect;
var utilities    = require("./helpers/utilities");

describe("A logger", function () {
	var restoreEnvironment;

	function captureOutput (fn) {
		var buffer   = [];
		var oldWrite = process.stdout.write;

		process.stdout.write = buffer.push.bind(buffer);
		try {
			fn();
		}
		finally {
			process.stdout.write = oldWrite;
		}

		return buffer.join("");
	}

	before(function () {
		restoreEnvironment = utilities.clearEnvironment();
	});

	after(function () {
		restoreEnvironment();
	});

	describe("using the default settings", function () {
		var output;

		before(function () {
			var logger = createLogger();

			output = captureOutput(function () {
				logger.info("hello");
			});
		});

		it("logs to stdout", function () {
			expect(output, "failed to write to stdout").to.contain("hello\n");
		});
	});

	describe("with NODE_ENV set to 'test'", function () {
		var restoreEnvironment;

		before(function () {
			restoreEnvironment = utilities.setEnvironmentVariable("NODE_ENV", "test");
		});

		after(function () {
			restoreEnvironment();
		});

		it("is silent", function () {
			var logger = createLogger();
			var output = captureOutput(function () {
				logger.info("hello");
			});

			expect(output, "wrote to stdout").to.equal("");
		});

		describe("and ENABLE_LOGGING set to 'true'", function () {
			var restoreEnvironment;

			before(function () {
				restoreEnvironment = utilities.setEnvironmentVariable("ENABLE_LOGGING", "true");
			});

			after(function () {
				restoreEnvironment();
			});

			it("logs to stdout", function () {
				var logger = createLogger();
				var output = captureOutput(function () {
					logger.info("hello");
				});

				expect(output, "failed to write to stdout").to.contain("hello\n");
			});
		});
	});
});
