'use strict';
var userService = require('../../services/user'),
    auth = require('../../lib/auth');

module.exports = function(server) {

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/:username/gifts', function (req, res, next) {
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
                return res.send(503, {});
            }
            userService
                .getGiftsById(user._id, {limit: 18, page: Math.abs(parseInt(req.param('page'), 10))}, function (err, gifts) {
                    if (err) {
                        return res.send(500, {
                            status: 'error',
                            message: res.__('Wystąpił nieoczekiwany błąd')
                        });
                    }
                    return res.send(gifts);
                });
        });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.post('/api/users/:id/follow', auth.isAuthenticated, function (req, res) {
        userService
            .follow(req.user._id, req.param('id'), function (err) {
                if (err) {
                    return res.send(500, {});
                }
                res.send({
                    status: 'success'
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.delete('/api/users/:id/follow', auth.isAuthenticated, function (req, res) {
        userService
            .unfollow(req.user._id, req.param('id'), function (err) {
                if (err) {
                    return res.send(500, {});
                }
                res.send({
                    status: 'success'
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.post('/api/users/:id/block', auth.isAuthenticated, function (req, res) {
        userService
            .block(req.user._id, req.param('id'), function (err) {
                if (err) {
                    return res.send(500, {});
                }
                res.send({
                    status: 'success'
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.delete('/api/users/:id/block', auth.isAuthenticated, function (req, res) {
        userService
            .unblock(req.user._id, req.param('id'), function (err) {
                if (err) {
                    return res.send(500, {});
                }
                res.send({
                    status: 'success'
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/:username/follows', function (req, res, next) {
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
                return res.send(503, {});
            }
            userService
                .getFollowedById(user._id, {
                    total: user.stats.follows,
                    limit: 18,
                    page: Math.abs(parseInt(req.param('page'), 10))
                }, function (err, users) {
                    if (err) {
                        return res.send(500, {
                            status: 'error',
                            message: res.__('Wystąpił nieoczekiwany błąd')
                        });
                    }
                    return res.send(users);
                });
        });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/:username/followers', function (req, res, next) {
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
                return res.send(503, {});
            }
            userService
                .getFollowingById(user._id, {
                    total: user.stats.followers,
                    limit: 18,
                    page: Math.abs(parseInt(req.param('page'), 10))
                }, function (err, users) {
                    if (err) {
                        return res.send(500, {
                            status: 'error',
                            message: res.__('Wystąpił nieoczekiwany błąd')
                        });
                    }
                    return res.send(users);
                });
        });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/:username/photos', function (req, res, next) {
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
                return res.send(503, {});
            }
            userService
                .getPhotosById(user._id, {
                    limit: 18,
                    page: Math.abs(parseInt(req.param('page'), 10))
                }, function (err, photos) {
                    if (err) {
                        return res.send(500, {
                            status: 'error',
                            message: res.__('Wystąpił nieoczekiwany błąd')
                        });
                    }
                    return res.send(photos);
                });
        });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/:username/videos', function (req, res, next) {
        userService.getByUsername(req.param('username'), function(err, user, next) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next();
            }
            if (!req.isAuthenticated() && user.settings.anonymous_disallowed) {
                return res.send(503, {});
            }
            userService
                .getVideosById(user._id, {
                    limit: 18,
                    page: Math.abs(parseInt(req.param('page'), 10))
                }, function (err, videos) {
                    if (err) {
                        return res.send(500, {
                            status: 'error',
                            message: res.__('Wystąpił nieoczekiwany błąd')
                        });
                    }
                    return res.send(videos);
                });
        });
    });
};
