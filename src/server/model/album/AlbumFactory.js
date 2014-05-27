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

		return this._copyFile(file, _id).then(function(file) {
            return new Promise(function(resolve, reject) {
                log.info('treatFile finished' + file);
                this.db.collection('albumcollection').update({_id: new ObjectId(_id)}, {$push: {files:file}}, function(err, result) {
                    if (err) {
                        log.error('add file failed', err);
                        return reject(err);
                    }
                    resolve(file);
                    this._compressFile(_id, file);
                    this._makeArchive(_id);
                }.bind(this));
            }.bind(this));
        }.bind(this))
        .catch(log.error);

	},

    updateFile : function(_id, file){
        return new Promise(function(resolve, reject) {
            log.info('updating file ' + file.id + ' from album ' + _id, file);
            this.db.collection('albumcollection').update({_id: new ObjectId(_id), "files.id": file.id}, {$set: {"files.$" : file}}, function(err, result) {
                if (err) {
                    log.error('delete file failed', err);
                    return reject(err);
                }
                log.success('successfully updated file ' + file.id + ' from album ' + _id);
                return resolve();
            }.bind(this));
        }.bind(this))
        .catch(log.error.bind(log));
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

	_copyFile : function (file, albumId) {
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

                return resolve(image);
            }.bind(this));
        }.bind(this));

	},

    _makeArchive : function (_id) {
        process.nextTick(function(){
            var archiver = require(config.serverDir + '/utils/archiveProcesses.js').addAlbum(_id);
        });
    },

    _compressFile : function (_id, file) {
        process.nextTick(function(){
            var compressor = require(config.serverDir + '/utils/compressProcesses.js').addImage(_id, file);
        });
    }


}
