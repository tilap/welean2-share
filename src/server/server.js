var argv = require('minimist')(process.argv.slice(2));
if (!argv.production) {
    console.log('Dev mode');
}else{
    console.log('Production mode');
    require('newrelic');
}
var express = require('express');
var i18n = require("i18n");
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

/**********************
* INTERNATIONALISATION
***********************/
i18n.configure({
    locales:['en', 'fr'],
    directory: config.serverDir + '/locales',
    updateFiles: false
    //,defaultLocale: 'en'
});
log.info('i18n configured : ', i18n);
log.info('locale : ' + i18n.getLocale());


/***********
* APP
************/
var app = express();

app.set('views', config.serverDir + '/views');
app.use(express.static('public'));
app.use(cookieParser());
app.use(i18n.init);

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
var port = argv.port || config.port || 3000;
var server = app.listen(port, function() {
    log.success('We are on ! Listening on port ' + server.address().port);
});
