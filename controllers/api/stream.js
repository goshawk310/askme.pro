'use strict';
var userService = require('../../services/user'),
    questionService = require('../../services/question'),
    likeService = require('../../services/like'),
    commentService = require('../../services/comment'),
    auth = require('../../lib/auth'),
    Q = require('q');

module.exports = function(server) {

    server.get('/api/stream', auth.isAuthenticated, function (req, res) {
        if (req.param('mode') === 'friends') {
            return Q.ninvoke(questionService, 'getAnswered', {
                to: req.user.users.followed,
                limit: 10,
                page: 0,
                from: req.user._id,
                lastAnsweredAt: req.param('lastAnsweredAt') || null,
                firstAnsweredAt: req.param('firstAnsweredAt') || null,
                blocked: [req.user._id].concat(req.user.users.blocked)
            })
            .then(function (results) {
                return results;
            })
            .then(function (data) {
                if (!data.questions.length) {
                    data.likes = [];
                    return data;
                }
                return Q.ninvoke(likeService, 'getByUsersFollowed', {
                    followed: req.user.users.followed, 
                    userId: req.user._id,
                    lastCreatedAt: req.param('lastLikeAt') || null,
                    firstCreatedAt: req.param('firstLikeAt') || null,
                })
                .then(function (docs) {
                    data.likes = docs;
                    return data;
                }, function () {
                    return data;
                });
            })
            .then(function (data) {
                if (!data.questions.length) {
                    data.comments = [];
                    return data;
                }
                return Q.ninvoke(commentService, 'getByUsersFollowed', {
                    followed: req.user.users.followed, 
                    userId: req.user._id,
                    lastCreatedAt: req.param('lastCommentAt') || null,
                    firstCreatedAt: req.param('firstCommentAt') || null,
                })
                .then(function (docs) {
                    data.comments = docs;
                    return data;
                }, function () {
                    return data;
                });
            })
            .then(function (data) {
                res.send(data);
            })
            .fail(function (err) {
                if (err) {
                    return next(err);
                }
            })
            .done();
        } else {
            questionService.getAnswered({
                to: null,
                limit: 10,
                page: 0,
                from: req.user._id,
                lastAnsweredAt: req.param('lastAnsweredAt') || null,
                firstAnsweredAt: req.param('firstAnsweredAt') || null,
                blocked: [req.user._id].concat(req.user.users.blocked)
            }, function(err, results) {
                if (err) {
                    return res.send(500, []);
                }
                res.send(results);
            });
        }
    });
};