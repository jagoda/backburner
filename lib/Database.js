var mongo  = require("mongoskin");
var q      = require("q");

function Collection (database, name) {
	var collection = database.collection(name);

	this.create = function (item) {
		var deferred = q.defer();

		collection.insert(item, deferred.makeNodeResolver());

		return deferred.promise.spread(function (item) {
			delete item._id;
			return item;
		});
	};
}

function Database (url) {
	var database = mongo.db(url);

	this.instances = new Collection(database, "instances");
}

module.exports = Database;
