'use strict';
var suggestionsService = require('../../services/suggestions'),
    auth = require('../../lib/auth');

module.exports = function(server) {

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/suggestions/users', function (req, res, next) {
        suggestionsService.getUsers({
            followed: req.isAuthenticated() ? req.user.users.followed : null,
            blocked: req.isAuthenticated() ? [req.user._id].concat(req.user.users.blocked).concat(req.param('excluded') || []) : null,
            limit: req.param('limit')
        }, function(err, docs) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(docs);
        });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/suggestions/questions', function (req, res, next) {
        suggestionsService.getQuestions({
            blocked: req.isAuthenticated() ? [req.user._id].concat(req.user.users.blocked) : null
        }, function(err, docs) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(docs);
        });
    });
}