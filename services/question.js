'use strict';
var QuestionModel = require('../models/question'),
    mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = _.extend(require('../lib/service'), {
    ask: function ask(callback) {
        var req = this.getReq(),
            res = this.getRes(),
            data = req.body.question,
            question = new QuestionModel();
        question.set({
            to: mongoose.Types.ObjectId(data.to),
            contents: data.contents
        });
        if (Boolean(parseInt(data.anonymous, 10))) {
            question.from = null;
        } else {
            question.from = mongoose.Types.ObjectId(req.user.id)
        }
        question.save(callback);
    }
});