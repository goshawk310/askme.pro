'use strict';
var questionService = require('../services/question'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.get('/inbox', auth.isAuthenticated, function (req, res) {
        res.render('inbox');
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/inbox/questions', auth.isAuthenticated, function (req, res) {
        questionService.getUnansweredByUserId(
            req.user._id,
            req.user.stats.questions_unanswered,
            parseInt(req.param('perPage'), 10) || 10,
            parseInt(req.param('p'), 10) || 0,
            function (err, questions) {
                res.send({
                    total: req.user.stats.questions_unanswered,
                    questions: questions
                });
            });
    });

    /**
     * [description]
     * @param  {[type]} req
     * @param  {[type]} res
     * @return {[type]}
     */
    server.patch('/inbox/image/:id', auth.isAuthenticated, function (req, res) {
        questionService
            .setServer(server)
            .setReq(req)
            .setRes(res)
            .uploadImage({
                'id': req.param('id'),
                'to': req.user._id
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/inbox/answers', auth.isAuthenticated, function (req, res) {
        questionService.getAnsweredByUserId(
            req.user._id,
            parseInt(req.param('perPage'), 10) || 10,
            parseInt(req.param('p'), 10) || 0,
            function (err, results) {
                res.send(results);
            });
    });
};
