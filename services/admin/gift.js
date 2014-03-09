'use strict';
var UserGiftModel = require('../../models/user/gift'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    removeAllTo: function removeAllTo(id, callback) {
        UserGiftModel.removeAllTo(id, callback);
    },
    removeAllFrom: function removeAllFrom(id, callback) {
        UserGiftModel.removeAllFrom(id, callback);
    }
}, service);