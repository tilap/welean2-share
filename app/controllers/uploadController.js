
var multiparty = require('multiparty');
var fs = require('fs');
var AlbumFactory = require('../model/album/AlbumFactory');

module.exports = function(req, res) {

    var form = new multiparty.Form({
        uploadDir: './tmp'
    });

    form.parse(req, function(err, fields, files){
        if(err || !files.file || !files.file[0]){

			//@TODO manage error            
            console.log('upload error');

        } else {
            
            // Manage file
            var file = files.file[0];

            var moveTo = 'public/uploads/' + file.originalFilename;
            fs.rename(file.path, moveTo, function (err) {
                console.log('moved complete');
            });

            //save into Mongo
            var albumFactory = new AlbumFactory(req.db);
            albumFactory.addFile(req.param('uuid'), {path:''}).then(function() {
            	console.log('YOUPI');
            }).catch(console.log);

        }
    });

    console.log('Retour ok 200');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();

}; 