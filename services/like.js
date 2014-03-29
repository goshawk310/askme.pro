'use strict';
var LikeModel = require('../models/like'),
    mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = _.defaults({
    create: function create(params, callback) {
        var req = this.getReq(),
            res = this.getRes(),
            like = new LikeModel();
        like.set({
            question_id: params.question_id,
            to: params.to,
            from: params.from
        });
        like.save(callback);
    },
    remove: function remove(params, callback) {
        LikeModel
            .findOne(params)
            .exec(function (err, like) {
                if (err) {
                    return callback(err);
                }
                if (like === null) {
                    return callback(new Error('Like not found'));
                }
                like.remove(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, like);
                });
            });
    },
    getByQuestionId: function getByQuestionId(params, callback) {
        var req = this.getReq();
        LikeModel
            .find({question_id: params.id})
            .populate('from', 'username avatar stats')
            .exec(function (err, rows) {
                if (err) {
                    return callback(err);
                }
                var output = [],
                    like = null;
                if (req && req.user) {
                    rows.forEach(function (row) {
                        if (row.from && !(req.user.users.blocked && row.from.isBlocked(req.user.users.blocked))) {
                            like = row.toObject();
                            if ((req.user.users.followed && row.from.isFollowed(req.user.users.followed)) || String(like.from._id) === String(req.user._id)) {
                                like.from.isFollowed = true;
                            } else {
                                like.from.isFollowed = false;
                            }
                            output.push(like);
                        }
                    });
                } else {
                    rows.forEach(function (row) {
                        if (row.from) {
                            output.push(row.toObject());
                        }
                    });
                }
                return callback(null, output); 
            });
    },
    getTop: function getTop(params, callback) {
        var where = {
                to: params.to
            },
            limit = params.limit;
        LikeModel
            .find(where)
            .limit(limit)
            .sort({_id: -1})
            .populate('from', 'username avatar')
            .exec(callback);
    },
    getByUsersFollowed: function getByUsersFollowed(params, callback) {
        var where = {
                from: {$in: params.followed}
            },
            limit: params.limit || 10,
            skip = limit && params.page ? (limit) * params.page : null,;
        if (params.lastCreatedAt && validator.validators.isDate(params.lastCreatedAt)) {
            where.created_at = {$lt: new Date(params.lastCreatedAt)};
        } else if (params.firstCreatedAt && validator.validators.isDate(params.firstCreatedAt)) {
            where.created_at = {$gt: new Date(params.firstCreatedAt)};
        }
    }
}, require('../lib/service'));