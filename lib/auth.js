'use strict';
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User = require('../models/user'),
    oauthConfig = require('../config/oauth');

module.exports = {
    getRoles: function getRoles() {
        return {
            'admin': ['admin', 'editor', 'user'],
            'editor': ['editor', 'user'],
            'user': ['user']
        }
    },
    configure: function configure(i18n) {
        passport.use(
            new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password'
            },
            function(username, password, done) {
                User.findOne({
                    username: new RegExp('^' + username + '$', 'i')
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user || user.status.value === 2) {
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
            })
        ).use(
            new FacebookStrategy({
                clientID: oauthConfig.facebook.clientID,
                clientSecret: oauthConfig.facebook.clientSecret,
                callbackURL: oauthConfig.facebook.callbackURL
            },
            function (accessToken, refreshToken, profile, done) {
                User.findOne({$or: [{email: new RegExp('^' + profile._json.email + '$', 'i')}, {'facebook.id': profile.id}]}, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        var data = profile._json,
                            user = new User({
                                username: data.username,
                                name: data.first_name,
                                lastname: data.last_name,
                                email: data.email,
                                profile: {
                                    fanpage: data.link,
                                    location: data.location.name
                                },
                                facebook: {
                                    id: data.id
                                },
                                status: {
                                    value: 0
                                },
                                password: require('crypto').randomBytes(6).toString('hex'),
                                terms_accepted: true,
                                incomplete: true
                            });
                        user.save(function (err, user) {
                            if (err) {
                                return done(err);
                            }
                            if (!user.facebook) {
                                user.set({
                                    facebook: {
                                        id: data.id
                                    }
                                });
                                user.save(function (err) {

                                });
                            }
                            done(null, user);
                        });
                    } else {
                        if (user.status.value === 2) {
                            return done(null, false, {
                                message: i18n.__('Nieprawidłowa nazwa użytkownia, lub hasło.')
                            });
                        }
                        if (user.status.value === 0) {
                            return done(null, false, {
                                message: i18n.__('Konto zostało zdezaktywowane.')
                            });
                        }
                        done(null, user);
                    }
                });
            })
        );
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
                if (req.user && req.user.incomplete) {
                    var urls = [
                        '/account/complete-registration',
                        '/account/logout',
                        '/account/check'
                    ];
                    if (urls.indexOf(req.url) === -1) {
                        return res.redirect('/account/complete-registration')
                    }
                    return next();
                }
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
    hasPrivilegesOf: function hasPrivilegesOf(role) {
        var roles = this.getRoles();
        return function (req, res, next) {
            if (req.isAuthenticated() && roles[req.user.role].indexOf(role) > -1) {
                next();
            } else {
                res.send(403);
            }
        };
    },
    getPassport: function getPassport() {
        return passport;
    }
};

