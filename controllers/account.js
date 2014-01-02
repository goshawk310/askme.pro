'use strict';
var auth = require('../lib/auth')(),
	captcha = require('easy-captcha');

module.exports = function (server) {
	
	server.get('/account/login', function (req, res) {
		res.render('account/login', {
			error: req.flash('error')
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

	server.get('/account/settings', auth.isAuthenticated, function (req, res) {
		res.render('account/settings', {user: req.user});
	});

	server.get('/account/forgotpassword', function (req, res) {
		res.render('account/recover_password');
	});

	server.get('/account/signup', function (req, res) {
		server.use('/captcha.jpg', captcha.generate({
			width:256,//set width,default is 256
		    height:60,//set height,default is 60
		    offset:40,//set text spacing,default is 40
		    quality:30
		}));

		var formData = req.flash('formData');
		res.render('account/signup', {
			errorMsg: req.flash('errorMsg'),
			formData: formData ? formData[0]: {}
		});
	});

	server.post('/account/signup', captcha.check, function (req, res) {
		if (!req.session.captcha.valid) {
			req.flash('errorMsg', 'captcha!');
			return res.redirect('/account/signup');
		}
		var userService = require('../services/user');
		userService.signup(req, res, function (req, res, user, err) {
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