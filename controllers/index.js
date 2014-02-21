'use strict';
var userService = require('../services/user'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.get('/', function(req, res) {
        if (!req.isAuthenticated()) {
            return res.render('index/welcome');
        }
        userService.getOnline({id: req.user._id}, function (err, users) {
            res.render('index', {
                mode: 'friends',
                onlineUsers: users
            });
        });
    });

    server.get('/stream', auth.isAuthenticated,  function(req, res) {
        userService.getOnline({id: req.user._id}, function (err, users) {
            res.render('index', {
                mode: 'all',
                onlineUsers: users
            });
        });
    });

    server.get('/online', auth.isAuthenticated,  function(req, res) {
        userService.getOnline({id: req.user._id}, function (err, users) {
            res.render('index/online', {
                onlineUsers: users
            });
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
