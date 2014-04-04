'use strict';
var CommentModel = require('../models/comment'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    validator = require('validator'),
    helpers = {
        getPreparedParams: function (req) {
            var limit = parseInt(req.param('limit'), 10) || 10,
                page = parseInt(req.param('page'), 10) || 1,
                overall = parseInt(req.param('overall'), 10) || limit,
                skip = overall - (limit * page),
                where = {question_id: req.param('id')};
            if (skip < 0) {
                skip = 0;
            }
            if (req.param('fvid')) {
                where._id = {'$lt': mongoose.Types.ObjectId(req.param('fvid'))};
            }
            return {
                limit: limit,
                skip: skip,
                where: where
            };
        }
    };

module.exports = _.defaults({
    create: function create(params, callback) {
        var comment = new CommentModel(),
            req = this.getReq();
        comment.set({
            question_id: params.question_id,
            contents: params.contents,
            from: params.from
        });
        comment.save(function (err, comment) {
            if (err) {
                return callback(err);
            }
            var commentObj = comment.toObject();
            if (commentObj.from !== null) {
                commentObj.from = {
                    _id: commentObj.from,
                    username: req.user.username,
                    avatar: req.user.avatar       
                };
            }
            callback(null, commentObj);
        });
    },
    getByQuestionId: function getByQuestionId(params, callback) {
        CommentModel.find({question_id: params.id})
            .populate('from', 'username avatar stats')
            .exec(callback);
    },
    getForQuestion: function getForQuestion(callback) {
        var params = helpers.getPreparedParams(this.getReq());
        CommentModel.find(params.where)
            .skip(params.skip).limit(params.limit)
            .sort({_id: 1})
            .populate('from', 'username avatar stats')
            .exec(callback);
    },
    /**
     * [remove description]
     * @param  {Object}   params
     * @param  {Function} callback
     * @return {void}
     */
    remove: function remove(params, callback) {
        CommentModel
            .findOne(params)
            .exec(function (err, comment) {
                if (err) {
                    return callback(err);
                }
                if (comment === null) {
                    return callback(new Error('Comment not found'));
                }
                comment.remove(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, comment);
                });
            });
    },
    getByUserTo: function getByUserTo(params, callback) {
        var where = {
                to: params.to
            },
            limit = params.limit;
        CommentModel.find(where)
            .limit(limit)
            .sort({_id: -1})
            .populate('from', 'username avatar')
            .exec(callback);
    },
    getByUsersFollowed: function getByUsersFollowed(params, callback) {
        var where = {
                from: {$in: params.followed},
                to: {$ne: params.userId}
            },
            $and = [{created_at: {$ne: null}}],
            limit = params.limit || 50,
            skip = limit && params.page ? (limit) * params.page : null;
        if (params.lastCreatedAt && validator.validators.isDate(params.lastCreatedAt)) {
            where.created_at = {$lt: new Date(params.lastCreatedAt)};
        } else if (params.firstCreatedAt && validator.validators.isDate(params.firstCreatedAt)) {
            where.created_at = {$gt: new Date(params.firstCreatedAt)};
        }
        var obj = {};
        for (var i in where) {
            obj = {};
            obj[i] = where[i];
            $and.push(obj);
        }
        CommentModel
            .find({$and: $and})
            .populate('from', 'username avatar')
            .populate('question_id', 'contents answer')
            .sort({created_at: -1})
            .skip(skip).limit(limit ? limit : null)
            .exec(function (err, docs) {
                if (err) {
                    return callback(err);
                }
                if (!docs || !docs.length) {
                    return callback(null, []);
                }
                var results = [],
                    fromIds = [];
                docs.forEach(function (doc) {
                    if (doc.from && fromIds.indexOf(String(doc.from._id)) < 0) {
                        fromIds.push(String(doc.from._id));
                        results.push(doc);
                        if (results.length === 5) {
                            return callback(null, results);
                        }
                    }
                });
                return callback(null, results);
            });
    }
}, require('../lib/service'));