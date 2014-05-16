var express = require('express');

var app = express();

var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

require('springbokjs-shim/es6');
// Connect to the db
var db = null;
MongoClient.connect("mongodb://localhost:27017/share", function(err, dbMongo) {
  if(!err) {
    console.log("We are connected");
    db = dbMongo;
  }
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use(express.static('public'));

app.set('views', __dirname + '/views');

app.use(cookieParser());

app.get('/:uuid', require('./controllers/albumController.js'));
app.get('/', require('./controllers/indexController.js'));

var upload = require('./utils/upload');
app.post('/upload', function(req, res) {
    upload('./tmp', req, function(){
        console.log('Retour ok 200');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end();
    });
    //res.render('uploaded.ejs', {});
});
 

app.listen(1337);