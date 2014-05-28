'use strict';
var UserModel = require('../models/user'),
    SettingService = require('../services/setting'),
    _ = require('underscore');
module.exports = {
    words: [],
    test: function test(contents, userId, next) {
        var thisObj = this;
        SettingService.getByKey('blockedWords', function (err, setting) {
            var blockedWords = [];
            if (!err && setting) {
                blockedWords = thisObj.prepareWords(setting.value);
            }
            UserModel.findOne({_id: userId}, function (err, user) {
                if (err) {
                    next(err);
                }
                if (user === null) {
                    next(new Error('User not found'));
                }
                var pattern = null;
                if (user.blocked_words && user.blocked_words.length) {
                    blockedWords = _.union(blockedWords, thisObj.prepareWords(user.blocked_words));
                }
                pattern = new RegExp(blockedWords.join('|'), 'i');
                if (pattern.test(contents)) {
                    next(new Error('Banned word occurred'));
                } else {
                    next();
                }
            });
        });
    },
    prepareWords: function prepareWords(value) {
        var words = value.split(' ').map(function (word) {
            return ('' + word).trim();
        });
        words = words.filter(function (word) {
            return Boolean(word.length);
        });
        words = words.map(function (word) {
            return word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        });
        return words;
    },
    setWords: function setWords(words) {
        if (!_.isArray(words)) {
            words = this.prepareWords(words);
        } 
        this.words = words;
        return this;
    },
    filter: function filter(value, fields) {
        var thisObj = this,
            filterText = function filterText(text) {
                if (!text) {
                    return text;
                }
	        return text.replace(new RegExp(thisObj.words.join('|'), 'gi'), function (s) {
                    var i = 0,
                        word = "",
                        wordLength = s.length;
                    while (i < wordLength) {
                        if (wordLength < 3 || (i > 0 && i < wordLength - 1)) {
                            word += '*';
                        } else {
                            word += s[i];
                        }
                        i++;
                    }
                    return word;
            });
        };
        if (_.isArray(value)) {
            _.each(value, function (element) {
                _.each(fields, function (field) {
                    element[field] = filterText(element[field]);
                });
            });
        } else if (_.isObject(value)) {
            _.each(fields, function (field) {
                value[field] = filterText(value[field]);
            });
        } else {
            value = filterText(value);
        }
        return value;
    }
};

