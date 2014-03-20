'use strict';
var UserModel = require('../../models/user'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    countAll: function countAll(callback) {
        UserModel.count({}, callback);
    },
    getUsers: function getUsers(callback) {
        var req = this.getReq(),
            whereOr = [],
            conds = {},
            thisObj = this;
        if (req.param('query')) {
            whereOr.push({username: {$regex: new RegExp('^' + req.param('query') + '$', 'i')}});
        }
        if (whereOr.length) {
            conds.$or = whereOr;
        }
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