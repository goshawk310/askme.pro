'use strict';
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('../models/User');

module.exports = function () {
	return {
		configure: function() {
			
			passport.serializeUser(function(user, done) {
			  done(null, user.id);
			});

			passport.deserializeUser(function(id, done) {
			  User.findById(id, function (err, user) {
			    done(err, user);
			  });
			});

			passport.use(new LocalStrategy({
				usernameField: 'username',
    		passwordField: 'password'
			}, function (username, password, done) {
			  User.findOne({username: username}, function (err, user) {
			    if (err) { 
			    	return done(err); 
			    }
			    if (!user) { 
			    	return done(null, false, { message: 'Unknown user ' + username }); 
			    }
			    if (password === user.passowrd) {
			    	return done(null, user);
			    }
			    return done(null, false, {message: 'Invalid password'});
			  });
			}));
		},
		init: function(server) {
			server.use(passport.initialize());
			server.use(passport.session());
		}
	};
};