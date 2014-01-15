'use strict';
var userService = require('../services/user'),
    UserModel = require('../models/user');

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

    server.get('/:username', function (req, res, next) {
        userService
            .setReq(req)
            .setRes(res)
            .setNext(next);
        userService.getByUsername(req.param('username'), function (err, user, next) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next();
            }
            res.render('index/profile', {
                profile: user
            });
        });
        
    });
};
