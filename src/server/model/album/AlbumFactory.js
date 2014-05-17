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

	            fs.mkdirSync(base_directory);
	            fs.mkdirSync(base_directory + '/miniature');
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
	    	
		    this._treatFile(file, _id).then(function(file) {
		    	log.info('treatFile finnished', file);
		    	this.db.collection('albumcollection').update({_id: new ObjectId(_id)}, {$push: {files:file}}, function(err, result) {
					if (err) {
						log.error('add file failed', err);
						return reject(err);
					}
					resolve(file);
		    	});	
		    }.bind(this)).catch(console.log);

		}.bind(this))
	},

	_treatFile : function (file, albumId) {

		return new Promise(function(resolve, reject) {

			// Create uuid
			var uuidGenerator = require('node-uuid');
			var uuid = uuidGenerator.v4();

			// Get extension
			var path = require('path')
			var extension = '.jpg';

			var moveTo = this.UPLOAD_DIR + '/' + albumId + '/' + this.ORIGIN + '/' + uuid + extension;
		    fs.rename(file.path, moveTo, function (err) {

		        if (err) {
		        	log.error('file', err);
		        	log.error('file', moveTo);
		        	reject('problem with move');
		        	return;
		        } 

		        // Put the final paths into the file
		        file.paths = {};
	        	file.paths.origin = '/' + this.PUBLIC_PATH + '/' + albumId + '/' + this.ORIGIN + "/"  + uuid + extension;
	        	file.paths.miniature = '/' + this.PUBLIC_PATH + '/' + albumId + '/' + this.MINIATURE + "/"  + uuid + extension;
	        	file.paths.slideshow = '/' + this.PUBLIC_PATH + '/' + albumId + '/' + this.SLIDESHOW + "/"  + uuid + extension;
				
	        	delete file.path;

	        	// compress image
	        	var gm = require("gm").subClass({ imageMagick: true });

	        	// miniature
	        	gm(this.UPLOAD_DIR + '/' + albumId + '/' + this.ORIGIN + '/'  + uuid + extension)
	        	.autoOrient() 
	        	.resize(null, 300 + '>')
	        	.gravity('Center')
	        	//.extent(null, 300)
	        	.write(this.UPLOAD_DIR + '/' + albumId + '/' + this.MINIATURE + '/'  + uuid + extension, function(err) {
	        		if (err) {
		        		reject(err);
		        		log.error('error for mini', err);
	        		}
	        	}.bind(this));

	        	// slideshow
	        	gm(this.UPLOAD_DIR + '/' + albumId + '/' + this.ORIGIN + '/'  + uuid + extension)
	        	.autoOrient() 
	        	.resize(null, 1000 + '>')
	        	.write(this.UPLOAD_DIR + '/' + albumId + '/' + this.SLIDESHOW + '/' + uuid + extension, function(err) {
	        		if (err) {
		        		reject(err);
		        		log.error('error for slideshow', err);
	        		}
	        	}.bind(this));
				
	        	resolve(file);

		    }.bind(this));

		}.bind(this))

	}
}