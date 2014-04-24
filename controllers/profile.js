'use strict';
var userService = require('../services/user'),
    questionService = require('../services/question'),
    auth = require('../lib/auth'),
    Q = require('q');

module.exports = function(server) {

    server.get('/:username', function(req, res, next) {
        return Q.npost(userService, 'getByUsername', [req.param('username')])
        .then(function (user) {
            if (!user) {
                throw new Error('notFound');
            }
            if (!req.isAuthenticated() && user.settings.anonymous_disallowed) {
                throw new Error('unauthorized');
            }
            if (req.isAuthenticated() && user.users && req.user.isBlocked(user.users.blocked)) {
                throw new Error('notFound');        
            }
            var isFollowed = false,
                isBlocked = false;
            if (req.isAuthenticated() && req.user.users) {

                isFollowed = req.user.users.followed ? user.isFollowed(req.user.users.followed) : false;
                isBlocked = req.user.users.blocked ? user.isBlocked(req.user.users.blocked) : false;
            }
            return [user, {
                profile: user,
                isFollowed: isFollowed,
                isBlocked: isBlocked
            }];
        })
        .spread(function (user, data) {
            data.gifts = [];
            if (user.stats.gifts_received) {
                return Q.ninvoke(userService, 'getUserProfileGifts', user._id)
                .then(function (gifts) {
                    data.gifts = gifts;
                    return [user, data];
                }, function () {
                    return [user, data];
                });
            } else {
                return [user, data];
            }
        })
        .spread(function (user, data) {
            data.onlineUsers = [];
            return Q.ninvoke(userService, 'getOnline', {
                blocked: req.isAuthenticated() && req.user.users ? req.user.users.blocked : null,
                limit: 48
            }).then(function (users) {
                data.onlineUsers = users;
                return data;
            }, function () {
                return data;
            });
        })
        .then(function (data) {
            return res.render('profile', data);
        })
        .fail(function (err) {
            if (err && err.message) {
                if (err.message === 'unauthorized') {
                    req.flash('error', res.__('Aby przeglądać tą stronę trzeba się zalogować'));
                    return res.redirect('/account/login');
                } else if (err.message === 'notFound') {
                    return next();
                }
            }
            if (err) {
                return next(err);
            }
        })
        .done(); 
    });

    /**
     *
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/:username/answers', function(req, res) {
        userService.getByUsername(req.param('username'), function(err, user, next) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next();
            }
            if (!req.isAuthenticated() && user.settings.anonymous_disallowed) {
                req.flash('error', res.__('Aby przeglądać tą stronę trzeba się zalogować'));
                return res.send(500, {});
            }
            questionService.getAnswered({
                to: user._id,
                limit: 10,
                page: parseInt(req.param('p'), 10) || 0,
                from: req.isAuthenticated() ? req.user._id : null
            }, function(err, results) {
                res.send(results);
            });
        });
    });
};
