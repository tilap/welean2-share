var AlbumFactory = require(config.serverDir + '/model/album/AlbumFactory');

module.exports = function(req, res) {

    var albumFactory = new AlbumFactory(req.db);
    albumFactory.get(req.param('uuid')).then(function(album) {
        var isNew = false;
        var error = '';
        var links = {};

        if (album && album.files) {
            files = album.files;
            links.download = config.uploadPath + '/' + album._id + '/archive.zip';
            links.new_album = '/';
        } else {
            files = [];
            isNew = true;
            log.info('Probably new album ' + req.param('uuid'));
        }

        if (isNew) {
        	res.render('index.ejs', {'isnew': true, 'files' : files, 'links': links, 'error':'', 'IMAGE_PATH': albumFactory.PUBLIC_PATH});
        } else {
        	res.render('index.ejs', {'isnew': false, 'files' : files, 'links': links, 'error':'', 'IMAGE_PATH': albumFactory.PUBLIC_PATH});
        }

    }).catch(function(){
        log.warning('Unexisting album ' + req.param('uuid'));
        res.render('index.ejs', {'files' : [], 'error':'Mauvais code !!', 'links': links, 'isnew': false, 'IMAGE_PATH': albumFactory.PUBLIC_PATH});
    });
};
