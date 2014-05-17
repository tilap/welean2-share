require('newrelic');
var express = require('express');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
require('springbokjs-shim/es6');
global.config = require('../../config/app');
global.log = require(config.serverDir + '/utils/psrConsole');

/* log config */
log.info('Loaded configuration file : ', config);

/***********
* DB
************/
var db = null;
MongoClient.connect("mongodb://localhost:27017/share", function(err, dbMongo) {
  if(!err) {
    log.success("We are connected");
    db = dbMongo;
  } else {
      log.error('Unable to connect to mongodb !', err);
  }
});

/***********
* APP
************/
var app = express();

app.set('views', config.serverDir + '/views');
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
app.get('/:uuid/', require(config.serverDir + '/controllers/albumController.js'));
app.get('/', require(config.serverDir + '/controllers/indexController.js'));
app.post('/:uuid/upload/', require(config.serverDir + '/controllers/uploadController.js'));
//app.get('/:uuid/delete/', require(config.serverDir + '/controllers/deleteAlbumController.js'));
app.get('/:auid/delete/:iuid/', require(config.serverDir + '/controllers/deleteImageController.js'));


/***********
* GOOOO
************/
var server = app.listen(config.port, function() {
    log.success('We are on ! Listening on port ' + server.address().port);
});
