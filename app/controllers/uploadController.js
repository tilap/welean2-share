var upload = require('../utils/upload');

module.exports = function(req, res) {

    upload('./tmp', req, function(){
        console.log('Retour ok 200');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end();
    });

};