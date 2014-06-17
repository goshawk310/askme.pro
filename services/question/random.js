'use strict';
var QuestionRandomModel = require('../../models/question/random'),
    QuestionModel = require('../../models/question'),
    mongoose = require('mongoose'),
    _ = require('underscore');


module.exports = _.defaults({
    getRandom: function getRandom(params, callback) {
        var req = this.getReq();
        QuestionModel.find({
            $and: [{to: params.to}, {random_id: {$ne: null}}]
        })
        .exec(function (err, docs) {
            if (err) {
                return callback(err);
            }
            var ids = [];
            if (!err && docs.length) {
                docs.forEach(function (doc) {
                    ids.push(doc.random_id);
                });
            }
            docs = null;
            QuestionRandomModel.find({
                _id: {$nin: ids}
            }).exec(function (err, docs) {
                if (err) {
                    return callback(err);
                }
                if (!docs.length) {
                    return callback(new Error('No questions left'));
                }
                var index = parseInt(Math.floor(Math.random() * docs.length), 10);
                var question = new QuestionModel();
                question.set({
                    to: params.to,
                    contents: docs[index].contents,
                    ip: req.ip,
                    random_id: docs[index]._id
                });
                question.save(function (err, doc) {
                    callback(err, doc);
                });
                docs = null;    
            });
        });
    }
}, require('../../lib/service'));