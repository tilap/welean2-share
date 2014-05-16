require('newrelic');
var express = require('express');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
require('springbokjs-shim/es6');

/***********
* DB
************/
var db = null;
MongoClient.connect("mongodb://localhost:27017/share", function(err, dbMongo) {
  if(!err) {
    console.log("We are connected");
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
app.get('/', require('./controllers/indexController.js'));
app.post('/:uuid/upload/', require('./controllers/uploadController.js'));

/***********
* GOOOO
************/ 
app.listen(1337);