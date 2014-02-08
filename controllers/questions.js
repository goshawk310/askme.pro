'use strict';
var questionService = require('../services/question'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.get('/questions/:id', auth.isAuthenticated,  function(req, res) {
        questionService.getAnswered({id: req.param('id'), from: req.user._id}, function (err, results) {
            if (err) {
                return res.render(404, 'errors/404');
            }
            res.render('question', {question: (results.questions.length ? results.questions[0] : null)});
        });
    });
};
