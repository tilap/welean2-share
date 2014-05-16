var AlbumFactory = require('../model/album/AlbumFactory');

module.exports = function(req, res) {

    var albumFactory = new AlbumFactory(req.db);
	var album = albumFactory.get(req.param('uuid')).then(function(album) {
		if (album && album.files) {
			console.log(album.files);
		} else {
			console.log('FUCK');
		}
		res.render('index.ejs', {});

	}).catch(console.log);
}




var Hashids = require('hashids'),
hashids = new Hashids('Welean rocks!');

var hash = hashids.encrypt(12345);
//console.log(hash);
// hash is now 'ryBo'

var numbers = hashids.decrypt('ryBo');
// numbers is now [ 12345 ] 