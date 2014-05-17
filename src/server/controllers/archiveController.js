var AlbumFactory = require('../model/album/AlbumFactory');
var log = require('../utils/psrConsole');
var fstream = require('fstream'),
    tar = require('tar'),
    zlib = require('zlib');

module.exports = function(req, res) {

    var albumFactory = new AlbumFactory(req.db);
    var album = albumFactory.get(req.param('uuid')).then(function(album) {

        if (album && album.files) {
            console.log(album);
            files = album.files;

            res.writeHead(200, {
                'Content-Type'        : 'application/octet-stream',
                'Content-Disposition' : 'attachment; filename=album_'+ album._id +'.zip',
                'Content-Encoding'    : 'gzip'
            });

            var folderWeWantToZip = 'public/uploads/' + album._id + '/origin';
            console.log('Zipping public/uploads/' + album._id + '/origin');

            /* Read the source directory */
            fstream.Reader({ 'path' : folderWeWantToZip, 'type' : 'Directory' })
                .pipe(tar.Pack())
                .pipe(zlib.Gzip())
                .pipe(response);
        } else {
            log.error('Unable to create an archive for an empty album ' + req.param('uuid'));
        }
        //res.render('index.ejs', {'files' : files, 'error':'', 'isNew':isNew, 'IMAGE_PATH': albumFactory.PUBLIC_PATH});

    }).catch(function(){
        log.warning('Unexisting album ' + req.param('uuid'));
        //@todo manage renderer
        //res.render('index.ejs', {'files' : [], 'error':'Mauvais code !!', 'isNew': false, 'IMAGE_PATH': albumFactory.PUBLIC_PATH});
    });
}




var Hashids = require('hashids'),
    hashids = new Hashids('Welean rocks!');

var hash = hashids.encrypt(12345);
//console.log(hash);
// hash is now 'ryBo'

var numbers = hashids.decrypt('ryBo');
// numbers is now [ 12345 ]
