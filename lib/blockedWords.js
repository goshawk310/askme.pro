'use strict';
var UserModel = require('../models/user'),
    _ = require('underscore');
module.exports = {
    test: function test(contents, userId, next) {
        var blockedWords = ['chuj', 'cipa', 'dupa', 'kurwa', 'bladź'];
        UserModel.findOne({_id: userId}, function (err, user) {
            if (err) {
                next(err);
            }
            if (user === null) {
                next(new Error('User not found'));
            }
            var userBlockedWords = [],
                pattern = null;
            if (user.blocked_words.length) {
                userBlockedWords = user.blocked_words.split(' ').map(function (word) {
                    return ('' + word).trim();
                });
                blockedWords = _.union(blockedWords, userBlockedWords);
            }
            blockedWords = blockedWords.filter(function (word) {
                return Boolean(word.length);
            });
            pattern = new RegExp(blockedWords.join('|'), 'i');
            if (pattern.test(contents)) {
                next(new Error('Banned word occurred'));
            } else {
                next();
            }
        });
    }
};

