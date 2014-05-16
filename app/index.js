var express = require('express');
var app = express();

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.get('/', function(req, res) {
	res.render('index.ejs', {});
});
app.post('/upload', function(req, res) {
    console.log('Uploaded');
    //res.render('uploaded.ejs', {});
});


app.listen(1337);