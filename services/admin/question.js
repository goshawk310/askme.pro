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
    }
}, service);