'use strict';
var userService = require('../services/user'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.get('/', function(req, res) {
        if (!req.isAuthenticated()) {
            return userService.getSome({limit: 10}, function (err, users) {
                res.render('index/welcome', {
                    users: users
                });
            });
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

    server.get('/online', auth.isAuthenticated,  function(req, res) {
        userService.getOnline({id: req.user._id, followed: req.user.users.followed, blocked: req.user.users.blocked, limit: 120}, function (err, users) {
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
        res.redirect('back');
    });
};
