'use strict';
var userService = require('../services/user'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.get('/top20',  function(req, res) {
        res.render('top20');
    });
};
