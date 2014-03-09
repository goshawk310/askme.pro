'use strict';
var CommentModel = require('../../models/comment'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    removeAllTo: function removeAllTo(id, callback) {
        CommentModel.removeAllTo(id, callback);
    },
    removeAllFrom: function removeAllFrom(id, callback) {
        CommentModel.removeAllFrom(id, callback);
    }
}, service);