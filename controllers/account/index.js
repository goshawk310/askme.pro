'use strict';
var auth = require('../../lib/auth')(),
    captcha = require('easy-captcha'),
    check = require('validator').check,
    userService = require('../../services/user'),
    UserModel = require('../../models/user'),
    StickerModel = require('../../models/sticker'),
    _ = require('underscore');

module.exports = function (server) {

    server.get('/account/login', function (req, res) {
        var error = req.flash('error'),
            message = error.length ? {error: error} : null;
        res.render('account/login', {
            message: message
        });
    });

    server.post('/account/login', auth.getPassport().authenticate('local', {
        successRedirect: '/site/activity',
        failureRedirect: '/account/login',
        failureFlash: true
    }));

    server.get('/account/logout', function (req, res) {
        server.locals.user = null;
        req.logout();
        res.redirect('/');
    });
    
    
    server.get('/account/forgotpassword', function (req, res) {
        res.render('account/reset_password', {
            message: req.flash('message')[0]
        });
    });

    server.post('/account/forgotpassword', function (req, res) {
        if (!check(req.body.email).isEmail()) {
            req.flash('message', {
                error: res.__('Niepoprawny adres email.')
            });
            return res.redirect('/account/forgotpassword');
        }
        userService.resetPassword(req, res, function (req, res, err) {
            if (err) {
                req.flash('message', {
                    error: res.__('Wystąpił błąd podczas resetowania hasła.')
                });
                return res.redirect('/account/forgotpassword');
            }
            req.flash('message', {
                success: res.__('Hasło zostało zresetowane.')
            });
            return res.redirect('/account/forgotpassword');
        });
    });

    server.get('/account/signup', function  (req, res) {
        var formData = req.flash('formData');
        res.render('account/signup', {
            message: req.flash('message'),
            formData: formData ? formData[0] : {}
        });
    });

    server.post('/account/signup', captcha.check, function  (req, res) {
        if (!req.session.captcha.valid) {
            req.flash('message', {error: res.__('Niepoprawny kod captcha')});
            return res.redirect('/account/signup');
        }
        userService.signup(req, res, function(req, res, user, err) {
            if (err) {
                req.flash('formData', req.body);
                req.flash('message', {error: res.__('Wystąpił błąd')});
                return res.redirect('/account/signup');
            }
            req.login(user, function(err) {
                if (err) {
                    throw err;
                }
                return res.redirect('/site/activity');
            });
        });
    });

    server.get('/account/check', function (req, res) {
        var conds = {},
            alreadyExistsMsg = '',
            errorMessage = res.__('Wystąpił nieoczekiwany błąd.');;
        if (req.query.username) {
            conds = {username: req.query.username};
            alreadyExistsMsg = res.__('Podana nazwa użytkownika jest już zajęta.');
        } else if (req.query.email) {
            conds = {email: req.query.email};
            alreadyExistsMsg = res.__('Podany adres e-mail jest już zajęty.');
        } else {
            return res.json(errorMessage);
        }
        UserModel.findOne(conds, function(err, user) {
            var message = null;
            if (err) {
                message = res.__(errorMessage);
            } else if (user === null) {
                message = true;
            } else {
                message = res.__(alreadyExistsMsg);
            }
            res.json(message);
        });
    });

    
    
};
