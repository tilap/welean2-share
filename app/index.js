var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.set('views', __dirname + '/views');

app.use(cookieParser());

app.get('/', require('./controllers/indexController.js'));


app.listen(1337);