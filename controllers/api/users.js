'use strict';
var userService = require('../../services/user'),
    questionService = require('../../services/question'),
    auth = require('../../lib/auth'),
    Q = require('q');

module.exports = function(server) {

    server.get('/api/user/:username', auth.isAuthenticated, function(req, res, next) {
        return Q.npost(userService, 'getByUsername', [req.param('username')])
        .then(function (user) {
            if (!user) {
                throw new Error('notFound');
            }
            var isFollowed = false,
                isBlocked = false;
            return Q.ninvoke(req.user, 'isBlockedBy', user._id)
                .then(function (isBlocked) {
                    if (isBlocked) {
                        throw new Error('blocked');
                    }
                    if (req.user.users) {
                        isFollowed = req.user.users.followed ? user.isFollowed(req.user.users.followed) : false;
                        isBlocked = req.user.users.blocked ? user.isBlocked(req.user.users.blocked) : false;
                    }
                    return {
                        profile: user,
                        isFollowed: isFollowed,
                        isBlocked: isBlocked
                    };
                });
        })
        .then(function (data) {
            return res.send(data);
        })
        .fail(function (err) {
            if (err) {
                res.send(500, err);
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
            .setRes(res)
            .follow(req.user._id, req.param('id'), function (err) {
                if (err) {
                    return res.send(500, err);
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
                    limit: 6,
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

    /**
     * [description]
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/online', auth.isAuthenticated, function (req, res) {
        userService
            .getOnline({id: req.user._id}, function (err, users) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: err
                    });
                }
                return res.send(users);
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/search', auth.isAuthenticated, function (req, res) {
        userService
            .search({
                query: req.param('q'),
                page: parseInt(req.param('page'), 10) || 0,
                limit: parseInt(req.param('limit'), 10) || 18
            }, function (err, results) {
                if (err) {
                    return res.send(500, {
                        status: 'error'
                    });
                }
                return res.send(results);
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/top20', function (req, res) {
        userService
            .setReq(req)
            .getTop20({mode: req.param('mode')}, function (err, results) {
                if (err) {
                    return res.send(500, {
                        status: 'error'
                    });
                }
                return res.send(results);
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/followed', auth.isAuthenticated, function (req, res) {
        userService
            .getFollowedUsers({
                followed: req.user.users.followed,
                blocked: req.user.users.blocked
            }, function (err, users) {
                if (err) {
                    return res.send(500, {});
                }
                res.send(users);
            });
    });

    server.post('/api/users/login', auth.getPassport().authenticate('local', {}), function (req, res) {
        res.json({id: req.user.id});    
    });

    server.get('/api/users/logout', function (req, res) {
        if (req.user) {
            userService.logout(req.user._id);
        }
        server.locals.user = null;
        req.logout();
        res.redirect('/');
    });

    server.get('/api/users/:id/answers', auth.isAuthenticated, function (req, res) {
        questionService.setServer(server);
        questionService.getAnswered({
            to: req.param('id'),
            limit: 10,
            page: parseInt(req.param('p'), 10) || 0,
            from: req.user._id,
            liked: parseInt(req.param('liked'), 10) === 1 ? true : false
        }, function(err, results) {
            res.send(results);
        });
    });
};
