module.exports = function(req, res) {

    images = [
        '01 - laos moines chartio.jpeg',
        '02 - angkor chartio.jpeg'
    ];

	res.render('index.ejs', {'images' : images});

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
