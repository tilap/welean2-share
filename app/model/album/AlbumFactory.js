var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');
var log = require('../../utils/psrConsole');


module.exports = function(db) {

	this.db = db;

	/*********
	* CONFIG
	**********/
	// @todo put that in another file
	this.ORIGIN = 'origin';
	this.MINIATURE = 'miniature';
	this.SLIDESHOW = 'slideshow';
	this.PUBLIC_PATH = 'uploads';
	this.UPLOAD_DIR = 'public/uploads';

}

module.exports.prototype = {
	create : function() {

		return new Promise(function(resolve, reject) {

			this.db.collection('albumcollection').insert({}, function(err, result) {

				if (err) {
					return reject(err);
				}

				var album = result[0];

				// Create directory to put file inside
	            var base_directory = this.UPLOAD_DIR + '/' + album._id;
	            log.info('base_directory', base_directory);

	            fs.mkdirSync(base_directory);
	            fs.mkdirSync(base_directory + '/min');
	            fs.mkdirSync(base_directory + '/slideshow');
	            fs.mkdirSync(base_directory + '/origin');

				resolve(album);
			}.bind(this));

		}.bind(this))

	},

	get : function(_id) {

		return new Promise(function(resolve, reject) {
			this.db.collection('albumcollection').find({_id: new ObjectId(_id)}).toArray(function(err, result) {

				if (err || result.length != 1) {
					return reject(err);
				}
				var album = result[0];
				resolve(album); 
			});

		}.bind(this))

	},

	addFile : function (_id, file) {


		return new Promise(function(resolve, reject) {
	    	
		    this._treatFile(file, _id).then(function() {
		    	log.info('treatFile finnished', _id);
		    	this.db.collection('albumcollection').update({_id: new ObjectId(_id)}, {$push: {files:file}}, function(err, result) {
					if (err) {
						log.error('add file failed', err);
						return reject(err);
					}
					log.info('resolve', result);
					var album = result[0];
					resolve(album); 
		    	});	
		    }.bind(this)).catch(console.log);

		}.bind(this))
	},

	_treatFile : function (file, albumId) {

		return new Promise(function(resolve, reject) {

			var moveTo = this.UPLOAD_DIR + '/' + albumId + '/' + this.ORIGIN + '/' + file.name;
			log.info(moveTo);
		    fs.rename(file.path, moveTo, function (err) {

		        if (err) {
		        	log.error('file', err);
		        	log.error('file', moveTo);
		        	reject('problem with move');
		        	return;
		        } 

		        // Put the final path into the file
	        	file.path = '/' + this.PUBLIC_PATH + '/' + albumId + '/' + this.ORIGIN + "/" + file.name;

	        	resolve();

		    }.bind(this));

		}.bind(this))

	}
}