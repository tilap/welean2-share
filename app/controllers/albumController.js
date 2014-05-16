var AlbumFactory = require('../model/album/AlbumFactory');
var log = require('../utils/psrConsole');

module.exports = function(req, res) {

    var albumFactory = new AlbumFactory(req.db);
	var album = albumFactory.get(req.param('uuid')).then(function(album) {
		if (album && album.files) {
            files = album.files;
		} else {
            files = [];
		}
		res.render('index.ejs', {'files' : files, 'IMAGE_PATH': albumFactory.PUBLIC_PATH});

	}).catch(log.error);
}




var Hashids = require('hashids'),
hashids = new Hashids('Welean rocks!');

var hash = hashids.encrypt(12345);
//console.log(hash);
// hash is now 'ryBo'

var numbers = hashids.decrypt('ryBo');
// numbers is now [ 12345 ] 
