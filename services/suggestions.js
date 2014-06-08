'use strict';
var UsergModel = require('../models/user'),
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
    }
}, require('../lib/service'));