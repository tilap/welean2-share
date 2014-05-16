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