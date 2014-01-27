'use strict';
var userService = require('../services/user'),
    questionService = require('../services/question'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.get('/:username', function(req, res, next) {
        userService
            .setReq(req)
            .setRes(res)
            .setNext(next);
        userService.getByUsername(req.param('username'), function(err, user, next) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next();
            }
            if (!req.isAuthenticated() && user.settings.anonymous_disallowed) {
                req.flash('error', res.__('Aby przeglądać tą stronę trzeba się zalogować'));
                return res.redirect('/account/login');
            }
            if (user.stats.gifts_received) {
                userService.getUserProfileGifts(user._id, function (err, gifts) {
                    if (err) {
                        return res.render('profile', {
                            profile: user,
                            gifts: []
                        });
                    }
                    return res.render('profile', {
                        profile: user,
                        gifts: gifts
                    });
                });
            } else {
                res.render('profile', {
                    profile: user,
                    gifts: []
                });
            }
        });
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
