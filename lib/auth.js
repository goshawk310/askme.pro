'use strict';
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user');

module.exports = {
    configure: function configure(i18n) {
        passport.use(
            new LocalStrategy({
                    usernameField: 'username',
                    passwordField: 'password'
                },
                function(username, password, done) {
                    User.findOne({
                        username: username
                    }, function(err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (!user) {
                            return done(null, false, {
                                message: i18n.__('Nieprawidłowa nazwa użytkownia, lub hasło.')
                            });
                        }
                        if (user.status.value === 0) {
                            return done(null, false, {
                                message: i18n.__('Konto zostało zdezaktywowane.')
                            });
                        }
                        return user.comparePasswords(password, function(err, matched) {
                            if (matched) {
                                return done(null, user);
                            } else {
                                return done(null, false, {
                                    message: i18n.__('Nieprawidłowa nazwa użytkownia, lub hasło.')
                                });
                            }
                        });
                    });
                }));
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });
    },
    init: function init(server) {
        if (server.get('authInitialized') !== true) {
            server.use(passport.initialize());
            server.use(passport.session());
            server.use(function(req, res, next) {
                res.locals.user = req.user;
                if (!req.xhr && req.user) {
                    var now = new Date();
                    if (!req.user.last_visit_at || (now.getTime() - req.user.last_visit_at.getTime() > 120000)) {
                        User.update({_id: req.user._id}, {last_visit_at: now}, function () {
                        });
                    }
                }
                next();
            });
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

