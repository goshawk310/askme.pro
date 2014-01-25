'use strict';
var CommentModel = require('../models/comment'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
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

module.exports = _.extend({
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
    }
}, require('../lib/service'));