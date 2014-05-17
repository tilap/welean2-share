
var multiparty = require('multiparty');
var AlbumFactory = require(config.serverDir + '/model/album/AlbumFactory');

module.exports = function(req, res) {

    var form = new multiparty.Form({
        uploadDir: './tmp'
    });

    form.parse(req, function(err, fields, files){

        try {
            if (err || !files.file || !files.file[0]) {
                res.json(500, {'error' : 'technical problem'});
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
                    res.json(400, {'error' : 'bad mime type : ' + fileUploaded.headers['content-type']});
                    throw "Bad mime-type " + fileUploaded.headers['content-type'];
            }

            var file = {path: fileUploaded.path, name: fileUploaded.originalFilename};

            var albumFactory = new AlbumFactory(req.db);
            albumFactory.addFile(req.param('uuid'), file).then(function(file) {
                log.success('file added :)');
                res.json(200, file);
            }).catch(function(err){
                res.json(500, {'error' : 'technical problem'});
                throw err;
            });

        } catch(err) {
            console.log(err);
        }

    });

}; 