'use strict';
var userService = require('../../services/user'),
    questionService = require('../../services/question'),
    auth = require('../../lib/auth');

module.exports = function(server) {

    server.get('/api/activities', auth.isAuthenticated, function (req, res) {
        questionService.getAnswered({
            to: req.user.users.followed,
            limit: 10,
            page: parseInt(req.param('p'), 10) || 0,
            from: req.user._id,
            lastAnsweredAt: req.param('lastAnsweredAt') || null,
            firstAnsweredAt: req.param('firstAnsweredAt') || null
        }, function(err, results) {
            if (err) {
                return res.send(500, {});
            }
            res.send(results);
        });
    });
};