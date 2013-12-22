'use strict';


module.exports = function (server) {

    server.get('/', function (req, res) {
        var model = req.user;
        console.log(model);
        res.render('index', model);
        
    });

};
