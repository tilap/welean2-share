var ObjectId = require('mongodb').ObjectID;

module.exports = function(db) {

	this.db = db;

}

module.exports.prototype.createAlbum = function() {

	return new Promise(function(resolve, reject) {

		this.db.collection('albumcollection').insert({}, function(err, result) {

			if (err) {
				return reject(err);
			}

			var album = result[0];
			resolve(album); 
		});

	}.bind(this))

}

module.exports.prototype.getAlbum = function(_id) {

	return new Promise(function(resolve, reject) {

		this.db.collection('albumcollection').find({_id: _id}, function(err, result) {

			if (err) {
				return reject(err);
			}

			var album = result[0];
			resolve(album); 
		});

	}.bind(this))

}

module.exports.prototype.addFile = function (_id, file) {

	console.log(_id);
	console.log('file'+file);

	return new Promise(function(resolve, reject) {

	    this.db.collection('albumcollection').update({_id: new ObjectId(_id)}, {$push: {files:file}}, function(err, result) {
				if (err) {
					return reject(err);
				}

				var album = result[0];
				resolve(); 
	    }); 

	}.bind(this))

}