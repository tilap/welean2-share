var multiparty = require('multiparty');
var AlbumFactory = require(config.serverDir + '/model/album/AlbumFactory');

module.exports = function(req, res) {

    var albumFactory = new AlbumFactory(req.db);
    var album = albumFactory.get(req.param('auid')).then(function(album) {

        if (album && album.files) {
            albumFactory.deleteFile(album._id, req.param('iuid')).then(function() {
                log.success('file deleted :)');
                res.json(200, {});
            }).catch(function(err){
                res.json(500, {'error' : 'technical problem'});
                throw err;
            });
        } else {
            log.info('Probably new album ' + req.param('auid'));
        }


    }).catch(function(){
        log.warning('Unexisting album ' + req.param('auid'));
    });

}; 