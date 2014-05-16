module.exports = function(req, res) {
	res.render('index.ejs', {});

	var collection = req.db.collection('albumcollection');
    collection.find({},{},function(e,docs){
        //console.log(docs);
    });
}




var Hashids = require('hashids'),
hashids = new Hashids('Welean rocks!');

var hash = hashids.encrypt(12345);
//console.log(hash);
// hash is now 'ryBo'

var numbers = hashids.decrypt('ryBo');
// numbers is now [ 12345 ] 