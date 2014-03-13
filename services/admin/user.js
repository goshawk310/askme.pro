'use strict';
var UserModel = require('../../models/user'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    paginate: function paginate(query) {
        var req = this.getReq(),
            limit = req.param('per_page') ? parseInt(req.param('per_page'), 10) : 15,
            skip = req.param('page') ? parseInt(req.param('page'), 10) - 1 : 0,
            sortBy = req.param('sort_by') || null,
            sortOrder = req.param('order') === 'desc' ? -1 : 1;
        if (limit > 50) {
            limit = 50;
        }
        if (limit) {
            query.limit(limit);
        }
        if (skip) {
            query.skip(skip);
        }
        if (sortBy) {
            var sort = {};
            sort[sortBy] = sortOrder;
            query.sort(sort);
        }
        return query;
    },
    countAll: function countAll(callback) {
        UserModel.count({}, callback);
    },
    getUsers: function getUsers(callback) {
        var req = this.getReq(),
            regex = new RegExp(req.param('query'), 'i'),
            whereOr = [{username: {$regex: regex}}],
            conds = {
                $or: whereOr
            },
            thisObj = this;
        UserModel.count(conds, function (err, total) {
            thisObj.paginate(UserModel.find(conds))
            .exec(function (err, rows) {
                callback(err, rows, total);
            });
        })    
    },
    patch: function patch(id, callback) {
        var req = this.getReq();
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return callback(err);
            }
            if (!user || user._id === req.user._id) {
                return callback(new Error('User not found'));
            }
            user.set(req.body);
            user.save(callback)
        })
    },
    remove: function remove(id, callback) {
        var req = this.getReq();
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return callback(err);
            }
            if (!user || user._id === req.user._id) {
                return callback(new Error('User not found'));
            }
            user.remove(callback)
        })
    }
}, service);