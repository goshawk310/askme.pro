'use strict';
var auth = require('../lib/auth')(),
    captcha = require('easy-captcha'),
    check = require('validator').check,
    userService = require('../services/user');

module.exports = function(server) {

    server.get('/account/login', function(req, res) {
        res.render('account/login', {
            error: req.flash('error')
        });
    });

    server.post('/account/login', auth.getPassport().authenticate('local', {
        successRedirect: '/site/activity',
        failureRedirect: '/account/login',
        failureFlash: true
    }));

    server.get('/account/logout', function(req, res) {
        server.locals.user = null;
        req.logout();
        res.redirect('/');
    });

    server.get('/account/settings', auth.isAuthenticated, function(req, res) {
        res.render('account/settings', {
            user: req.user
        });
    });

    server.get('/account/forgotpassword', function(req, res) {
        res.render('account/reset_password', {
            message: req.flash('message')[0]
        });
    });

    server.post('/account/forgotpassword', function(req, res) {
        if (!check(req.body.email).isEmail()) {
            req.flash('message', {
                error: res.__('Niepoprawny adres email.')
            });
            return res.redirect('/account/forgotpassword');
        }
        userService.resetPassword(req, res, function(req, res, err) {
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

    server.get('/account/signup', function(req, res) {
        server.use('/captcha.jpg', captcha.generate());
        var formData = req.flash('formData');
        res.render('account/signup', {
            errorMsg: req.flash('errorMsg'),
            formData: formData ? formData[0] : {}
        });
    });

    server.post('/account/signup', captcha.check, function(req, res) {
        if (!req.session.captcha.valid) {
            req.flash('errorMsg', 'captcha!');
            return res.redirect('/account/signup');
        }
        userService.signup(req, res, function(req, res, user, err) {
            if (err) {
                req.flash('formData', req.body);
                req.flash('errorMsg', 'Wystąpił błąd!');
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

};
