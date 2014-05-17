var Hashids = require('hashids');
var AlbumFactory = require(config.serverDir + '/model/album/AlbumFactory');

module.exports = function(req, res) {
	
	var albumFactory = new AlbumFactory(req.db);
	albumFactory.create()
	.then(function(album) {
		res.redirect('/' + album._id + '/'); 
	}).catch(log.error);

} 