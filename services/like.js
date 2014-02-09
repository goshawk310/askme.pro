'use strict';
var LikeModel = require('../models/like'),
    mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = _.extend({
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
        LikeModel
            .find({question_id: params.id})
            .populate('from', 'username avatar stats')
            .exec(callback);
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
    }
}, require('../lib/service'));