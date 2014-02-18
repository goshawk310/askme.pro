'use strict';
var QuestionOfTheDayModel = require('../../models/question/ofTheDay'),
    mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = _.extend({
    ask: function ask(callback) {
        var req = this.getReq();
        
    }
}, require('../../lib/service'));