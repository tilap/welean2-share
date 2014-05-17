var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');


module.exports = function(db) {
	this.db = db;
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
	            var base_directory = config.uploadDir + '/' + album._id;

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

		return this._treatFile(file, _id).then(function(file) {
            return new Promise(function(resolve, reject) {
                log.info('treatFile finnished', file);
                this.db.collection('albumcollection').update({_id: new ObjectId(_id)}, {$push: {files:file}}, function(err, result) {
                    if (err) {
                        log.error('add file failed', err);
                        return reject(err);
                    }
                    resolve(file);
                    this._makeArchive(_id);
                }.bind(this));
            }.bind(this));
        }.bind(this))
        .catch(log.error);

	},

	_treatFile : function (file, albumId) {
        // Create uuid
        var uuidGenerator = require('node-uuid');
        var uuid = uuidGenerator.v4();

        // Get extension
        var path = require('path')
        var extension = '.jpg';

        var moveTo = config.uploadDir + '/' + albumId + '/' + config.originFolderName + '/' + uuid + extension;
        return new Promise(function(resolve, reject) {
            fs.rename(file.path, moveTo, function (err) {

                if (err) {
                    log.error('file', err);
                    log.error('file', moveTo);
                    return reject('problem with move');
                }

                // Put the final paths into the file
                file.paths = {};
                file.paths.origin = config.uploadPath + '/' + albumId + '/' + config.originFolderName + '/'  + uuid + extension;
                file.paths.miniature = config.uploadPath + '/' + albumId + '/' + config.miniatureFolderName + '/'  + uuid + extension;
                file.paths.slideshow = config.uploadPath + '/' + albumId + '/' + config.slideshowFolderName + '/'  + uuid + extension;

                delete file.path;

                resolve();
            }.bind(this));
        }.bind(this)).then(function() {
            // compress image
            var gm = require("gm").subClass({ imageMagick: true });

            return Promise.all([
                new Promise(function(resolve, reject) {
                    // miniature
                    gm(config.uploadDir + '/' + albumId + '/' + config.originFolderName + '/'  + uuid + extension)
                    .autoOrient()
                    .resize(null, 300 + '>')
                    .gravity('Center')
                    //.extent(null, 300)
                    .write(config.uploadDir + '/' + albumId + '/' + config.miniatureFolderName + '/'  + uuid + extension, function(err) {
                        if (err) {
                            reject(err);
                            log.error('error for mini', err);
                            return;
                        }
                        log.info ("writing : " + config.uploadDir + '/' + albumId + '/' + config.miniatureFolderName + '/'  + uuid + extension);
                        resolve();
                    }.bind(this))
                }.bind(this)),

                new Promise(function(resolve, reject) {
                    // slideshow
                    gm(config.uploadDir + '/' + albumId + '/' + config.originFolderName + '/'  + uuid + extension)
                    .autoOrient()
                    .resize(null, 1000 + '>')
                    .write(config.uploadDir + '/' + albumId + '/' + config.slideshowFolderName + '/' + uuid + extension, function(err) {
                        if (err) {
                            reject(err);
                            log.error('error for slideshow', err);
                            return;
                        }
                        log.info ("writing : " + config.uploadDir + '/' + albumId + '/' + config.slideshowFolderName + '/'  + uuid + extension);
                        resolve();
                    }.bind(this))
                }.bind(this))
            ]);
        }.bind(this))
        .then(function() {
            return file;
        });

	},

    _makeArchive : function (_id) {
        process.nextTick(function(){
            log.info("bah je passe !");
            //@todo manage require / app path
            var archiver = require(config.serverDir + '/utils/archiveProcesses.js').addAlbum(_id);
        });
    }

}
