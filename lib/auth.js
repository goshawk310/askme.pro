'use strict';
var	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('../models/user');

module.exports = function () {

	var configure = function configure(server) {
			server.locals.user = null;
			passport.serializeUser(function(user, done) {
				server.locals.user = user;
				done(null, user.id);
			});

			passport.deserializeUser(function(id, done) {
				User.findById(id, function (err, user) {
			    	done(err, user);
			  	});
			});

			passport.use(
				new LocalStrategy({
					usernameField: 'username',
		   			passwordField: 'password'
				},
				function (username, password, done) {
			  	User.findOne({username: username}, function (err, user) {
			    	if (err) { 
			    		return done(err); 
			    	}
			    	if (!user) { 
			    		return done(null, false, { message: 'Unknown user ' + username }); 
			    	}
			    	return user.comparePasswords(password, function(err, matched) {
			    		if (matched) {
			    			return done(null, user);
			    		} else {
			    			return done(null, false, {message: 'Invalid password'});
			    		}
			    	});
			    });
			}));
		},
		initialized = false;
	return {
		init: function init(server) {
			if (server.get('authInitialized') !== true) {
				configure(server);
				server.use(passport.initialize());
				server.use(passport.session());
				server.set('authInitialized', true);
			}
			
		},
		isAuthenticated: function isAuthenticated(req, res, next) {
			if (req.isAuthenticated()) {
				return next();		
			} else {
				res.redirect('/account/login');
			}
    	},
    	hasPrivilege: function hasPrivilege(req, res, next) {

    	},
		getPassport: function getPassport() {
			return passport;
		}
	};
};