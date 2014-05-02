'use strict';
var userService = require('../services/user'),
    questionService = require('../services/question'),
    likeService = require('../services/like'),
    commentService = require('../services/comment'),
    auth = require('../lib/auth'),
    Q = require('q');

module.exports = function(server) {
    server.get('/notifications', auth.isAuthenticated,  function(req, res) {
        return Q.ninvoke(likeService, 'getTop', {to: req.user._id, limit: 20})
        .then(function (likes) {
            return {
                likes: likes
            };
        })
        .then(function (data) {
            questionService.setServer(server);
            return Q.ninvoke(questionService, 'getAnsweredByUserFrom', {from: req.user._id, limit: 20})
            .then(function (questions) {
                data.questions = questions;
                return data;
            }, function () {
                return data;
            });
        })
        .then(function (data) {
            return Q.ninvoke(commentService, 'getByUserTo', {to: req.user._id, limit: 20})
            .then(function (comments) {
                data.comments = comments;
                return data;
            }, function () {
                return data;
            });
        })
        .then(function (data) {
            res.render('notifications', data);
        })
        .fail(function (err) {
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
    server.get('/ntfctns', auth.isAuthenticated, function(req, res) {
        res.send({
            questions: req.user.stats.questions_unanswered,
            likes: req.user.notifications.likes,
            feed: req.user.notifications.comments + req.user.notifications.answers
        });
    });
}