'use strict';
var auth = require('../lib/auth');

module.exports = function (server) {
	
	server.get('/account/login', function (req, res) {
		res.send(401, req.flash('error'));
	});

	server.post('/account/login', auth().getPassport().authenticate('local', {
		successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true
  }));
};