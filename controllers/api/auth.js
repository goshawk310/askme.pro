'use strict';
var userService = require('../../services/user'),
    auth = require('../../lib/auth'),
    UserModel  = require('../../models/user'),
    CryptoJS = require('crypto-js'),
    _ = require('underscore');

module.exports = function(server) {

	server.post('/api/auth/login', function (req, res, next) {
        if (req.body.login) {
            var decrypted = CryptoJS.TripleDES.decrypt(req.body.login, auth.token.privateKey).toString(CryptoJS.enc.Latin1),
                parts = decrypted.split(' ');
            req.body.username = parts[0];
            req.body.password = parts[1];
            next();  
        } else {
            next();
        }
    }, auth.getPassport().authenticate('local', {
        session: false
    }), function (req, res) {
        UserModel.findOne({
            _id: req.user._id
        }, function (err, doc) {
            if (doc) {
                var apiToken = null;
                if (!doc.api_token) {
                    apiToken = CryptoJS.SHA256(req.user._id + Date.now()).toString(CryptoJS.enc.Base64);
                    UserModel.update({
                        _id: doc._id
                    }, {
                        api_token: apiToken
                    }).exec();
                } else {
                    apiToken = doc.api_token;
                }

                var user = _.pick(req.user, '_id', 'username', 'settings', 'users', 'name', 'lastname', 'stats');
                user.api_token = apiToken;
                res.send(user);
            } else {
                res.send(500);
            }
        });
        
        
    });

    server.get('/api/auth/user', auth.isAuthenticated, function (req, res, next) {
        var user = _.pick(req.user, '_id', 'username', 'settings', 'users', 'name', 'lastname', 'stats', 'notifications', 'api_token');
        res.send(user);
    });
};