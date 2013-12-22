'use strict';
var auth = require('../lib/auth')();

module.exports = function (server) {
	
	server.get('/account/login', function (req, res) {
		res.render('account/login', {
			error: req.flash('error')
		});
	});

	server.post('/account/login', auth.getPassport().authenticate('local', {
		successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true
  }));

	server.get('/account/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	server.get('/account/settings', auth.isAuthenticated, function (req, res) {
		res.render('account/settings', {user: req.user});
	});



};