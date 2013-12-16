'use strict';


module.exports = function (server) {

    server.get('/', function (req, res) {
        var model = { name: 'krakentest' };
        
        res.render('index', model);
        
    });

};
