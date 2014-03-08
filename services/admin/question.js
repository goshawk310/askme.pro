'use strict';
var QuestionModel = require('../../models/question'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    deleteAllTo: function deleteAllTo(id, callback) {
        QuestionModel.removeAllTo(id, callback);
    }
}, service);