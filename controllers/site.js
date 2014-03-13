'use strict';

module.exports = function(server) {

    server.get('/site/terms', function(req, res) {
        res.render('site/terms');
    });

    server.get('/site/privacy', function(req, res) {
        res.render('site/privacy');
    });
};
