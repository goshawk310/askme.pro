'use strict';
var questionService = require('../services/question'),
    userService = require('../services/user'), 
    auth = require('../lib/auth'),
    Q = require('q');

module.exports = function(server) {

    server.get('/questions/:id', function(req, res) {
    	questionService.setServer(server);
        return Q.npost(questionService, 'getAnswered', [{id: req.param('id'), from: req.user ? req.user._id : null}])
        .then(function (results) {
            var question = results.questions.length ? results.questions[0] : null;
            if (!question) {
                //throw new Error('Question not found');
            }
            return Q.ninvoke(userService, 'getById', question.to._id)
            .then(function (profile) {
                var isFollowed = false,
                    isBlocked = false;
                if (req.user && req.user.users) {
                    isFollowed = req.user.users.followed ? profile.isFollowed(req.user.users.followed) : false;
                    isBlocked = req.user.users.blocked ? profile.isBlocked(req.user.users.blocked) : false;
                }    
                return [question, profile, isFollowed, isBlocked];    
            });
        })
        .spread(function (question, profile, isFollowed, isBlocked) {
            return res.render('question', {question: question, profile: profile, isFollowed: isFollowed, isBlocked: isBlocked});
        })
        .fail(function () {
            res.status(404);
            return res.render('errors/404');
        })
        .done();
    });
};
