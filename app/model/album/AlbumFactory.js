var ObjectId = require('mongodb').ObjectID;

module.exports = function(db) {

	this.db = db;

}

module.exports.prototype.create = function() {

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

module.exports.prototype.get = function(_id) {

	return new Promise(function(resolve, reject) {
		console.log(_id);
		this.db.collection('albumcollection').find({_id: new ObjectId(_id)}).toArray(function(err, result) {

			if (err || result.length != 1) {
				return reject(err);
			}
			console.log(result[0]);
			var album = result[0];
			resolve(album); 
		});

	}.bind(this))

}

module.exports.prototype.addFile = function (_id, file) {


	return new Promise(function(resolve, reject) {
    	
	    this.treatFile(file).then(function() {
	    	this.db.collection('albumcollection').update({_id: new ObjectId(_id)}, {$push: {files:file}}, function(err, result) {
				if (err) {
					return reject(err);
				}

				var album = result[0];
				resolve(); 
	    	}); 	
	    }).catch(console.log);

	}.bind(this))

}

module.exports.prototype.treatFile = function (file) {

	return new Promise(function(resolve, reject) {

		var moveTo = 'public/uploads/' + file.name;
	    fs.rename(file.path, moveTo, function (err) {
	        console.log('moved complete');

	        if (err) {
	        	reject('problem with move');
	        } else {
	        	file.path = 'uploads/' + file.name;
	        }

	    });

	}.bind(this))

}