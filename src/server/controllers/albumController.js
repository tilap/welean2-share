var AlbumFactory = require('../model/album/AlbumFactory');
var log = require('../utils/psrConsole');

module.exports = function(req, res) {

    var albumFactory = new AlbumFactory(req.db);
	var album = albumFactory.get(req.param('uuid')).then(function(album) {
        var isNew = false;
        var error = '';

		if (album && album.files) {
            files = album.files;
		} else {
            files = [];
            isNew = true;
            log.info('Probably new album ' + req.param('uuid'));
        }
        res.render('index.ejs', {'files' : files, 'error':'', 'isNew':isNew, 'IMAGE_PATH': albumFactory.PUBLIC_PATH});

	}).catch(function(){
        log.warning('Unexisting album ' + req.param('uuid'));
        res.render('index.ejs', {'files' : [], 'error':'Mauvais code !!', 'isNew': false, 'IMAGE_PATH': albumFactory.PUBLIC_PATH});
    });
}




var Hashids = require('hashids'),
hashids = new Hashids('Welean rocks!');

var hash = hashids.encrypt(12345);
//console.log(hash);
// hash is now 'ryBo'

var numbers = hashids.decrypt('ryBo');
// numbers is now [ 12345 ] 
