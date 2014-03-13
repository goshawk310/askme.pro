'use strict';
var UserModel = require('../models/user'),
    _ = require('underscore');
module.exports = {
    test: function test(contents, userId, next) {
        var blockedWords = 'askspace spytajmnie chuj free-zasilenia chuje chuju jebany jebanego kutasie dziwka suko jebana kurwo Contantina szmato pierdolona dobijam dobić hbo dobic psychol234 patrykkv topliste pserver facebook-photos.pl socialappspl CHOSZCZ Marcela0911 Miodekxxdd Monia301200 adf.ly Soniailulu AshkaaLOL tinylink.pl pacz progrmik ask.fm klart.org/iU kfd.pls4vdw ulinks.net51513'.split(' ');
        UserModel.findOne({_id: userId}, function (err, user) {
            if (err) {
                next(err);
            }
            if (user === null) {
                next(new Error('User not found'));
            }
            var userBlockedWords = [],
                pattern = null;
            if (user.blocked_words && user.blocked_words.length) {
                userBlockedWords = user.blocked_words.split(' ').map(function (word) {
                    return ('' + word).trim();
                });
                blockedWords = _.union(blockedWords, userBlockedWords);
            }
            blockedWords = blockedWords.filter(function (word) {
                return Boolean(word.length);
            });
            blockedWords = blockedWords.map(function (word) {
                return word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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

