'use strict';
var CommentModel = require('../models/comment'),
    mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = _.extend({
    create: function create(params, callback) {
        console.log('comment');
        console.log(params);
        var comment = new CommentModel();
        comment.set({
            question_id: params.question_id,
            contents: params.contents,
            from: params.from
        });
        comment.save(callback);
    },
    getByQuestionId: function getByQuestionId(params, callback) {
        CommentModel
            .find({question_id: params.id})
            .populate('from', 'username avatar stats')
            .exec(callback);
    }
}, require('../lib/service'));