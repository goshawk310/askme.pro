'use strict';
var LikeModel = require('../../models/like'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    removeAllTo: function removeAllTo(id, callback) {
        LikeModel.removeAllTo(id, callback);
    },
    removeAllFrom: function removeAllFrom(id, callback) {
        LikeModel.removeAllFrom(id, callback);
    }
}, service);