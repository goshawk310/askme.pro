'use strict';
var userService = require('../../services/user'),
    questionService = require('../../services/question'),
    likeService = require('../../services/like'),
    commentService = require('../../services/comment'),
    auth = require('../../lib/auth'),
    Q = require('q');

module.exports = function(server) {
    server.get('/api/notifications/likes/top', auth.isAuthenticated,  function(req, res) {
        likeService.getTop({to: req.user._id, limit: 3}, function (err, results) {
            if (err) {
                return res.send(500, {});
            }
            if (results.length) {
                userService.resetNotifications({
                    id: req.user._id,
                    key: 'likes'
                }, function () {

                });
            }
            res.send(results);
        });
    });

    server.get('/api/notifications/questions/top', auth.isAuthenticated,  function(req, res) {
        questionService.getUnansweredByUserId(req.user._id, 3, 0, function (err, results) {
            if (err) {
                return res.send(500, {});
            }
            res.send(results);
        });
    });

    server.get('/api/notifications/feed/top', auth.isAuthenticated,  function(req, res) {
        questionService.getAnsweredByUserFrom({from: req.user._id, limit: 3}, function (err, questions) {
            if (err) {
                return res.send(500, {});
            }
            commentService.getByUserTo({to: req.user._id, limit: 3}, function (err, comments) {
                if (err) {
                    return res.send(500, {});
                }
                userService.resetNotifications({
                    id: req.user._id,
                    key: ['answers', 'comments']
                }, function () {

                });
                res.send({
                    answers: questions,
                    comments: comments
                });
            })
            
        });
    });
}