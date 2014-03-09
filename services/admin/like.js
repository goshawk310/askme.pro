'use strict';
var LikeModel = require('../../models/like'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    deleteAllTo: function deleteAllTo(id, callback) {
        LikeModel.removeAllTo(id, callback);
    },
    deleteAllFrom: function deleteAllFrom(id, callback) {
        LikeModel.removeAllFrom(id, callback);
    }
}, service);