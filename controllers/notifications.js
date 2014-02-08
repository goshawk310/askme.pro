'use strict';
var userService = require('../services/user'),
    questionService = require('../services/question'),
    likeService = require('../services/like'),
    auth = require('../lib/auth'),
    Q = require('q');

module.exports = function(server) {
    server.get('/notifications/likes', auth.isAuthenticated,  function(req, res) {
        likeService.getAll({to: req.user._id}, function (err, results) {
            if (err) {
                return res.send(500, {});
            }
            res.send(results);
        });
    });
}