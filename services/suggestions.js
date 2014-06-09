'use strict';
var UsergModel = require('../models/user'),
    QuestionModel = require('../models/question'),
    _ = require('underscore');

module.exports = _.defaults({
    getUsers: function getUsers(params, callback) {
        var whereAnd = [];
        params = params || {};
        whereAnd.push({'status.value': 1});
        if (params.followed && _.isArray(params.followed)) {
            whereAnd.push({_id: {$nin: params.followed}});
        }
        if (params.blocked && _.isArray(params.blocked)) {
            whereAnd.push({_id: {$nin: params.blocked}});
        }
        UsergModel
            .find({$and: whereAnd})
            .select('username avatar name lastname profile.motto')
            .sort({'stats.likes': -1})
            .limit(params.limit ? parseInt(params.limit, 10) : 1)
            .exec(callback);
    },
    getQuestions: function getQuestions(params, callback) {
        var whereAnd = [],
            now = new Date();
        params = params || {};
        whereAnd.push({answered_at: {'$ne': null}});
        whereAnd.push({answered_at: {$gt: new Date(now.getTime() - 1000 * 60 * 60 * 24)}});
        if (params.blocked && _.isArray(params.blocked)) {
            whereAnd.push({to: {$nin: params.blocked}});
            whereAnd.push({from: {$nin: params.blocked}});
        }
        QuestionModel
            .find({$and: whereAnd})
            .populate('to', 'username avatar')
            .sort({'stats.likes': -1})
            .limit(10)
            .exec(function (err, docs) {
                if (err) {
                    return callback(err);
                }
                var picked = [];
                picked = picked.concat(docs.splice(parseInt(Math.random() * docs.length, 10), 1));
                picked = picked.concat(docs.splice(parseInt(Math.random() * docs.length, 10), 1));
                callback(null, picked);
            });
    }
}, require('../lib/service'));