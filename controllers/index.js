'use strict';
var userService = require('../services/user'),
    UserModel = require('../models/user'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.get('/', function(req, res) {
        if (!req.isAuthenticated()) {
            return res.render('index/welcome');
        }
        res.render('index', {
            mode: 'friends'
        });
    });

    server.get('/stream', auth.isAuthenticated,  function(req, res) {
        res.render('index', {
            mode: 'all'
        });
    });

    server.get('/locale/:locale', function(req, res) {
        res.cookie('locale', req.param('locale'), {
            maxAge: 900000,
            httpOnly: true
        });
        res.setLocale(req.param('locale'));
        res.redirect('back');
    });
};
