'use strict';
var UserModel = require('../models/user'),
    userSchema = require('mongoose').model('User'),
    Email = require('../lib/email');
module.exports = {
    signup: function signup(req, res, callback) {
        UserModel.schema.path('password').validate(function(password) {
            return password == req.body.password2;
        }, 'Passwords do not match.');
        var user = new UserModel(req.body);
        user.save(function(err, user) {
            callback(req, res, user, err);
        });
    },
    resetPassword: function resetPassword(req, res, callback) {
        UserModel.findOne({
            email: req.body.email
        }, function(err, user) {
            if (err) {
                return callback(req, res, err);
            }
            if (user === null) {
                return callback(req, res, new Error('User not found'));
            }
            return user.resetPassword(function(err, user, newPassword) {
                if (err) {
                    return callback(req, res, err);
                }
                var email = new Email();
                email.setSubject('Odzyskiwanie hasla dla konta askme.pro!')
                    .setTo(user.email)
                    .setHtml('Witaj<br/>Nowe haslo to: ' + newPassword)
                    .send(function(err, message) {
                        if (err) {
                            return callback(req, res, err);
                        }
                        return callback(req, res);
                    });
            });
        });
    },
    changeAvatar: function changeAvatar() {
        
    }
};
