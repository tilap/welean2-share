var Hashids = require('hashids'),
	AlbumFactory = require('../model/album/AlbumFactory');

module.exports = function(req, res) {
	
	var albumFactory = new AlbumFactory(req.db);
	albumFactory.createAlbum()
	.then(function(album) {
		res.redirect('/' + album._id + '/'); 
	}).catch(console.log);

} 