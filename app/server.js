require('newrelic');
var config = require('../config/app');
var express = require('express');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
require('springbokjs-shim/es6');
var log = require('./utils/psrConsole');

/***********
* DB
************/
var db = null;
MongoClient.connect("mongodb://localhost:27017/share", function(err, dbMongo) {
  if(!err) {
    log.success("We are connected");
    db = dbMongo;
  }
});

/***********
* APP
************/
var app = express();

app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(cookieParser());

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

/***********
* ROUTES
************/
app.get('/:uuid/', require('./controllers/albumController.js'));
app.get('/:uuid/archive', require('./controllers/archiveController.js'));
app.get('/', require('./controllers/indexController.js'));
app.post('/:uuid/upload/', require('./controllers/uploadController.js'));


/***********
* GOOOO
************/
var server = app.listen(config.port, function() {
    log.success('We are on ! Listening on port ' + server.address().port);
});
