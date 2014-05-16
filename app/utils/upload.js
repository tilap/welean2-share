
var multiparty = require('multiparty');
var fs = require('fs');

module.exports = function(dir, req, result){
    var form = new multiparty.Form({
        uploadDir: dir
    });
    form.parse(req, function(err, fields, files){
        if(err || !files.file || !files.file[0]){
            console.log('upload error');
            result(false, {});
        }else{
            var file = files.file[0];
            var moveTo = 'public/uploads/' + file.originalFilename;
            fs.rename(file.path, moveTo, function (err) {
                console.log('moved complete');
            });
            var image = {
                "name": file.originalFilename,
                "path": '/uploads/' + file.originalFilename
            };
            result(true, image);
            //console.log(files.upload.length);
        }
    });

}