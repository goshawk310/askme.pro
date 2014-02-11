'use strict';
var userService = require('../services/user'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.get('/search', auth.isAuthenticated,  function(req, res) {
        res.render('search', {
            query: req.param('q')
        });
    });
};
