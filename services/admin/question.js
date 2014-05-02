'use strict';
var QuestionModel = require('../../models/question'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    removeAllTo: function removeAllTo(id, callback) {
        QuestionModel.removeAllTo(id, callback);
    },
    removeAllFrom: function removeAllFrom(id, callback) {
        QuestionModel.removeAllFrom(id, callback);
    },
    getQuestions: function getQuestions(callback) {
        var req = this.getReq(),
            whereOr = [],
            conds = {},
            thisObj = this;
        if (req.param('query')) {
            whereOr.push({contents: {$regex: new RegExp(req.param('query'), 'i')}});
         	whereOr.push({naswer: {$regex: new RegExp(req.param('query'), 'i')}});
        }
        if (whereOr.length) {
            conds.$or = whereOr;
        }
        QuestionModel.count(conds, function (err, total) {
        	thisObj.paginate(QuestionModel.find(conds))
            .populate('from', 'username')
            .populate('og_from', 'username')
            .populate('to', 'username')
            .sort({_id: -1})
            .exec(function (err, rows) {
                callback(err, rows, total);
            });
        })    
    },
    remove: function remove(id, callback) {
        var req = this.getReq();
        QuestionModel.findOne({_id: id}, function (err, doc) {
            if (err) {
                return callback(err);
            }
            if (!doc) {
                return callback(new Error('Document not found'));
            }
            doc.remove(callback)
        })
    }
}, service);