
var multiparty = require('multiparty');
var AlbumFactory = require('../model/album/AlbumFactory');
var log = require('../utils/psrConsole');

module.exports = function(req, res) {

    var form = new multiparty.Form({
        uploadDir: './tmp'
    });

    form.parse(req, function(err, fields, files){
        if(err || !files.file || !files.file[0]){

			//@TODO manage error            
            log.error('upload error', file);

        } else {
            
            // Manage file
            var fileUploaded = files.file[0];

            var file = {path: fileUploaded.path, name: fileUploaded.originalFilename};

            //save into Mongo
            var albumFactory = new AlbumFactory(req.db);
            albumFactory.addFile(req.param('uuid'), file).then(function() {
            	log.success('file added :)');
            }).catch(log.error);

        }
    });
    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();

}; 