
var multiparty = require('multiparty');
var AlbumFactory = require(config.serverDir + '/model/album/AlbumFactory');

module.exports = function(req, res) {

    var form = new multiparty.Form({
        uploadDir: './tmp'
    });

    form.parse(req, function(err, fields, files){

        try {
            if (err || !files.file || !files.file[0]) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end(res.__('Un problème technique est survenu'));
                throw "Empty file";
            }

            var fileUploaded = files.file[0];
            switch(fileUploaded.headers['content-type']){
                case 'image/jpeg':
                case 'image/pjpeg':
                case 'image/png':
                case 'image/gif':
                    break;
                default:
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end(res.__('Type de fichier non autorisé') + ' : ' + fileUploaded.headers['content-type']);
                    throw "Bad mime-type " + fileUploaded.headers['content-type'];
            }

            var file = {path: fileUploaded.path, name: fileUploaded.originalFilename};

            var albumFactory = new AlbumFactory(req.db);
            albumFactory.addFile(req.param('uuid'), file).then(function(file) {
                log.success('file added :)');
                res.json(200, file);
            }).catch(function(err){
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end(res.__('Un problème technique est survenu'));
                console.log(err);
            });

        } catch(err) {
            console.log(err);
        }

    });

};
