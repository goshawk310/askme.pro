'use strict';
var UserGiftModel = require('../../models/user/gift'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    deleteAllTo: function deleteAllTo(id, callback) {
        UserGiftModel.removeAllTo(id, callback);
    },
    deleteAllFrom: function deleteAllFrom(id, callback) {
        UserGiftModel.removeAllFrom(id, callback);
    }
}, service);