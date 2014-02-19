'use strict';
var QuestionOfTheDayModel = require('../../models/question/ofTheDay'),
    QuestionModel = require('../../models/question'),
    mongoose = require('mongoose'),
    _ = require('underscore');

function getTodayCondition() {
    var today = new Date(),
        beginDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return {
        created_at: {
            $gte: beginDate,
            $lt: endDate
        }
    };    
};

module.exports = _.extend({
    ask: function ask(callback) {
        var req = this.getReq(),
            today = new Date(),
            beginDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        QuestionOfTheDayModel.findOne(getTodayCondition())
        .exec(function (err, question) {
            if (err) {
                return callback(err);
            }
            if (!question) {
                question = new QuestionOfTheDayModel({
                    contents: req.body.contents
                });
            } else {
                question.set({
                    contents: req.body.contents
                });
            }
            question.save(function (err) {
                if (err) {
                    return callback(err);
                }
            });
            callback();
        });
    },
    getTodays: function getTodays(callback) {
        QuestionOfTheDayModel.findOne(getTodayCondition())
        .exec(function (err, question) {
            if (err) {
                return callback(err);
            }
            return callback(null, question);
        });
    },
    getUnasweredByUserId: function getUnasweredByUserId(id, callback) {
        QuestionOfTheDayModel.findOne(getTodayCondition())
        .exec(function (err, questionOfTheDay) {
            if (err) {
                return callback(err);
            }
            if (questionOfTheDay) {
                QuestionModel.findOne({
                    qday_id: questionOfTheDay._id,
                    to: id
                })
                .exec(function (err, question) {
                    if (err) {
                        return callback(err);
                    }
                    if (question) {
                        return callback(null);
                    }
                    return callback(null, questionOfTheDay);
                });
            } else {
                return callback();
            }
        });
    }
}, require('../../lib/service'));