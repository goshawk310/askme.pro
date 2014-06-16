'use strict';
var QuestionRandomModel = require('../../../models/question/random'),
    service = require('../../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    getAll: function getAll(callback) {
        var req = this.getReq(),
            conds = {},
            thisObj = this;
        
        QuestionRandomModel.count(conds, function (err, total) {
        	thisObj.paginate(QuestionRandomModel.find(conds))
            .sort({_id: -1})
            .exec(function (err, rows) {
                callback(err, rows, total);
            });
        })    
    },
    addMultiple: function addMultiple(callback) {
        var req = this.getReq(),
            questions =  req.body.contents.split('\n'),
            i = 0,
            model;
        for (i = 0; i < questions.length; i += 1) {
            if (questions[i].length) {
                model = new QuestionRandomModel();
                model.set({
                    contents: questions[i].trim(),
                    created_by: req.user._id
                }).save();
            }
        }
        callback(null);
    },
    remove: function remove(id, callback) {
        var req = this.getReq();
        QuestionRandomModel.findOne({_id: id}, function (err, doc) {
            if (err) {
                return callback(err);
            }
            if (!doc) {
                return callback(new Error('Document not found'));
            }
            doc.remove(callback)
        });
    }
}, service);