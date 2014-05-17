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

    deleteFile : function (_id, fileId) {

            return new Promise(function(resolve, reject) {
                log.info('removing file ' + fileId + ' from album ' + _id);
                this.db.collection('albumcollection').update({_id: new ObjectId(_id)}, {$pull: {files: {id : fileId} }}, function(err, result) {
                    if (err) {
                        log.error('delete file failed', err);
                        return reject(err);
                    }
                    resolve();
                    this._makeArchive(_id);
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
        var image = {
            id : uuid,
            filename : uuid + extension,
            thumbnails: {
                origin : {
                    path: config.uploadPath + '/' + albumId + '/' + config.originFolderName + '/'  + uuid + extension,
                    size: {
                        width: null,
                        height: null
                    },
                    dir: config.uploadDir + '/' + albumId + '/' + config.originFolderName + '/'  + uuid + extension
                },
                miniature : {
                    path: config.uploadPath + '/' + albumId + '/' + config.miniatureFolderName + '/'  + uuid + extension,
                    size: {
                        width: null,
                        height: null
                    },
                    dir: config.uploadDir + '/' + albumId + '/' + config.miniatureFolderName + '/'  + uuid + extension
                },
                slideshow : {
                    path: config.uploadPath + '/' + albumId + '/' + config.slideshowFolderName + '/'  + uuid + extension,
                    size: {
                        width: null,
                        height: null
                    },
                    dir: config.uploadDir + '/' + albumId + '/' + config.slideshowFolderName + '/'  + uuid + extension
                }
            }
        };

        return new Promise(function(resolve, reject) {
            fs.rename(file.path, image.thumbnails.origin.dir, function (err) {

                if (err) {
                    log.error('file', err);
                    log.error('file', image.thumbnails.origin.dir);
                    return reject('problem with move');
                }

                delete file;

                resolve();
            }.bind(this));
        }.bind(this)).then(function() {
            // compress image
            var gm = require("gm").subClass({ imageMagick: true });

            return Promise.all([
                new Promise(function(resolve, reject) {
                    // miniature
                    gm(image.thumbnails.origin.dir)
                    .autoOrient()
                    .resize(null, 300)
                    .gravity('Center')
                    //.extent(null, 300)
                    .write(image.thumbnails.miniature.dir, function(err) {
                        if (err) {
                            reject(err);
                            log.error('error for mini', err);
                            return;
                        }
                        log.info ("writing : " + image.thumbnails.miniature.dir);

                        // size
                        gm(image.thumbnails.miniature.dir).size(function(err, val) {
                            image.thumbnails.miniature.size = val;
                            log.info('size', val);
                            resolve();
                        })
                    }.bind(this))
                }.bind(this)),

                new Promise(function(resolve, reject) {
                    // size of image
                    gm(image.thumbnails.origin.dir).size(function(err, val) {
                        image.thumbnails.origin.size = val;
                        log.info('size', val);
                        resolve();
                    })
                }.bind(this)),

                new Promise(function(resolve, reject) {
                    // slideshow
                    gm(image.thumbnails.origin.dir)
                    .autoOrient()
                    .resize(null, 1000 + '>')
                    .write(image.thumbnails.slideshow.dir, function(err) {
                        if (err) {
                            reject(err);
                            log.error('error for slideshow', err);
                            return;
                        }
                        log.info ("writing : " + image.thumbnails.slideshow.dir);
                        // size
                        gm(image.thumbnails.slideshow.dir).size(function(err, val) {
                            image.thumbnails.slideshow.size = val;
                            log.info('size', val);
                            resolve();
                        })
                    }.bind(this))
                }.bind(this))
            ]);
        }.bind(this))
        .then(function() {
            return image;
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
