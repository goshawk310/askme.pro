'use strict';
var userService = require('../services/user'),
    UserModel = require('../models/user'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.get('/', function(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/site/activity');
        }
        res.render('index');
    });

    server.get('/locale/:locale', function(req, res) {
        res.cookie('locale', req.param('locale'), {
            maxAge: 900000,
            httpOnly: true
        });
        res.setLocale(req.param('locale'));
        res.redirect('back');
    });
    
    server.get('/test', function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Credentials', true);
        res.render('test');
    });
};
