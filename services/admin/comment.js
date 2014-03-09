'use strict';
var CommentModel = require('../../models/comment'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    deleteAllTo: function deleteAllTo(id, callback) {
        CommentModel.removeAllTo(id, callback);
    },
    deleteAllFrom: function deleteAllFrom(id, callback) {
        CommentModel.removeAllFrom(id, callback);
    }
}, service);