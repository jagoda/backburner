function Configuration () {
	Object.defineProperties(this, {

		databaseUrl : {
			enumerable : true,
			value      : process.env.DATABASE_URL || "mongodb://localhost:27017/backburner",
			writable   : false
		}

	});
}

module.exports = Configuration;
