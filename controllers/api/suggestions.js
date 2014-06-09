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
    server.get('/api/suggestions/users', auth.isAuthenticated, function (req, res, next) {
        suggestionsService.getUsers({
            followed: req.user.users.followed,
            blocked: [req.user._id].concat(req.user.users.blocked).concat(req.param('excluded') || []),
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
    server.get('/api/suggestions/questions', auth.isAuthenticated, function (req, res, next) {
        suggestionsService.getQuestions({
            blocked: [req.user._id].concat(req.user.users.blocked)
        }, function(err, docs) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(docs);
        });
    });
}