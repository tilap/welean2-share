var express = require('express');
var fs = require('fs');

var app = express();

var multiparty = require('multiparty');

app.use(express.static('public'));

app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	res.render('index.ejs', {});
});
app.post('/upload', function(req, res) {
    uploadImage(req, function(){
        console.log('Retour ok 200');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end();
    });
    //res.render('uploaded.ejs', {});
});


var uploadImage = function(req, result){
    var form = new multiparty.Form({
        uploadDir: './tmp'
    });
    form.parse(req, function(err, fields, files){
        if(err || !files.file || !files.file[0]){
            console.log('upload error');
        }else{
            var file = files.file[0];
            var moveTo = 'public/uploads/' + file.originalFilename;
            fs.rename(file.path, moveTo, function (err) {
                console.log('moved complete');
            });
            result();
            //console.log(files.upload.length);
        }
    });

}


app.listen(1337);