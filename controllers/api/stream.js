'use strict';
var userService = require('../../services/user'),
    questionService = require('../../services/question'),
    auth = require('../../lib/auth');

module.exports = function(server) {

    server.get('/api/stream', auth.isAuthenticated, function (req, res) {
        questionService.getAnswered({
            to: req.param('mode') === 'friends' ? req.user.users.followed : null,
            limit: 10,
            page: 0,
            from: req.user._id,
            lastAnsweredAt: req.param('lastAnsweredAt') || null,
            firstAnsweredAt: req.param('firstAnsweredAt') || null,
            blocked: [req.user._id].concat(req.user.users.blocked)
        }, function(err, results) {
            if (err) {
                return res.send(500, {});
            }
            res.send(results);
        });
    });
};