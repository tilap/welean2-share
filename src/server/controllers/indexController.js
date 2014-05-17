var Hashids = require('hashids'),
	AlbumFactory = require('../model/album/AlbumFactory'),
	log = require('../utils/psrConsole');

module.exports = function(req, res) {
	
	var albumFactory = new AlbumFactory(req.db);
	albumFactory.create()
	.then(function(album) {
		res.redirect('/' + album._id + '/'); 
	}).catch(log.error);

} 