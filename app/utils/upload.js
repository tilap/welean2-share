var multiparty = require('multiparty');
var fs = require('fs');

module.exports = function(dir, tmp) {
	this.dir = dir;
	this.tmp = tmp;

}

module.exports.prototype.upload = function(req){
    return new Promise(function(resolve, reject) {

	    var form = new multiparty.Form({
	        uploadDir: dir
	    });

	    form.parse(req, function(err, fields, files){
	        if(err || !files.file || !files.file[0]){
	            reject('upload error');
	        }else{
	            var file = files.file[0];
	            var moveTo = 'public/uploads/' + file.originalFilename;
	            fs.rename(file.path, moveTo, function (err) {
	                console.log('moved complete');
	            });
	            resolve();
	            //console.log(files.upload.length);
	        }
	    });

	}.bind(this));

}