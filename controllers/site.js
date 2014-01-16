'use strict';
var auth = require('../lib/auth');

module.exports = function(server) {
    server.get('/site/activity', auth.isAuthenticated, function(req, res) {
        res.render('site/activity');
    });
};
