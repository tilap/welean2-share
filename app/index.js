var express = require('express');
var app = express();
app.set('views', __dirname + '/views');
app.get('/', function(req, res) {
	res.render('index.ejs', {});
});

app.listen(1337);