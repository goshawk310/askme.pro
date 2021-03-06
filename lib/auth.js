'use strict';
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User = require('../models/user'),
    oauthConfig = require('../config/oauth'),
    userService = require('../services/user'),
    _ = require('underscore');
module.exports = {
    token: {
        privateKey: 'c94766534f9cf37591810869fe1bb0c54c35122b'
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
                            userService.fixStatsCounter(user, function (user) {
                                return done(null, user);
                            });
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
                callbackURL: oauthConfig.facebook.callbackURL,
                profileFields: ['id', 'emails', 'name', 'first_name', 'last_name', 'link']
            },
            function (accessToken, refreshToken, profile, done) {
                var profileUserName = profile.username || profile.id,
                    profileEmail = profileUserName + '@facebook.com';
                profile.username = null;
                if (typeof profile.emails !== 'undefined' && profile.emails.length) {
                    profileEmail = profile.emails[0].value;
                    if (!profile.username) {
                        profileUserName = profileEmail.split('@')[0];
                    }
                }    
                User.findOne({$or: [{email: new RegExp('^' + profileEmail + '$', 'i')}, {'facebook.id': profile.id}]}, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        User.findOne({username: new RegExp('^' + profileUserName + '$', 'i')}, function (err, checkUser) {
                            if (!err && checkUser) {
                                profile.username = false;
                                profileUserName = profileUserName + '.' + (new Date()).getTime();
                            }
                            var data = profile._json,
                                user = new User({
                                    username: profileUserName,
                                    name: profile.name.givenName,
                                    lastname: profile.name.familyName,
                                    email: profileEmail,
                                    profile: {
                                        fanpage: profile.profileUrl,
                                        location: data.location && data.location.name ? data.location.name : null
                                    },
                                    facebook: {
                                        id: profile.id,
                                        r_no_username: !Boolean(profile.username),
                                        r_no_email: !Boolean(typeof profile.emails !== 'undefined' && profile.emails.length)
                                    },
                                    status: {
                                        value: 0
                                    },
                                    password: require('crypto').randomBytes(6).toString('hex'),
                                    terms_accepted: true,
                                    incomplete: true
                                });
                            user.save(function (err, user) {
                                return done(err, user);
                            });
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
                        if (!user.facebook) {
                            user.set({
                                facebook: {
                                    id: profile.id
                                }
                            })
                            .save(function (err, user) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                        userService.fixStatsCounter(user, function (user) {
                            return done(null, user);
                        });
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
    getRoles: function getRoles() {
        return {
            'admin': ['admin', 'moderator', 'editor', 'user'],
            'moderator': ['moderator', 'editor', 'user'],
            'editor': ['editor', 'user'],
            'user': ['user']
        };
    },
    init: function init(server) {
        if (server.get('authInitialized') !== true) {
            server.use(passport.initialize());
            server.use(passport.session());
            server.use(this.authorizedByToken)
            server.use(function(req, res, next) {
                res.locals.user = req.user;
                if (req.user && req.user.incomplete) {
                    var urls = [
                        '/account/complete-registration',
                        '/account/logout',
                        '/account/check',
                        '/site/terms',
                        '/site/privacy'
                    ];
                    if (urls.indexOf(req.path) === -1) {
                        return res.redirect('/account/complete-registration');
                    }
                    return next();
                }
                if (!req.xhr && req.user) {
                    var now = new Date();
                    if (!req.user.last_visit_at || (now.getTime() - req.user.last_visit_at.getTime() > 60000)) {
                        User.update({_id: req.user._id}, {last_visit_at: now, $addToSet: {ips: req.ip}}, function () {
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
    hasPrivilegesOf: function hasPrivilegesOf(role, toCheck) {
        var roles = this.getRoles();
        if (typeof toCheck === 'undefined') {
            return function (req, res, next) {
                if (req.isAuthenticated() && roles[req.user.role].indexOf(role) > -1) {
                    next();
                } else {
                    res.send(403);
                }
            };
        }
        return roles[toCheck].indexOf(role) > -1;
    },
    getPassport: function getPassport() {
        return passport;
    },
    authorizedByToken: function authorizedByToken(req, res, next) {
        if (!req.isAuthenticated() && req.headers['api-token']) {
            User.findOne({
                api_token: req.headers['api-token']
            }, function(err, user) {
                if (!err && user && user.status.value === 1) {
                    req['user'] = user;
                    req.isAuthenticated = function () {
                        return true;
                    };
                }
                next();
            });
        } else {
            next();
        }
    }
};

