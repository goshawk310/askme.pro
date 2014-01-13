'use strict';
var User = require('../../models/user'),
    auth = require('../../lib/auth');
module.exports = function(server) {
    

    server.get('/api/user/:username', function(req, res, next) {
        console.log(req.isAuthenticated());
        User.findOne({
            username: req.param('username')
        }, function(err, user) {
            if (err) {
                return next(err);
            } else if (user === null) {
                return next();
            }
            res.send(user);
        });
    });

    server.post('/api/user/create', function(req, res, next) {
        var user = new User(req.body);
        user.save(function(err, user) {
            if (err) {
                return next(err);
            }
            res.send(user);
        });
    });

    server.put('/api/user/update/:username', function(req, res, next) {
        User.update({
            username: req.param('username')
        }, req.body, function(err, numberAffected, raw) {
            if (err) {
                return next(err);
            }
            res.send(raw);
        });
    });
};
