'use strict';
var StickerModel = require('../../models/sticker'),
    service = require('../../lib/service'),
    _ = require('underscore');

module.exports = _.extend({
    get: function get(callback) {
        var req = this.getReq(),
            thisObj = this,
            conds = {};
        StickerModel.count(conds, function (err, total) {
            thisObj.paginate(StickerModel.find(conds))
            .exec(function (err, rows) {
                callback(err, rows, total);
            });
        })    
    },
    remove: function remove(id, callback) {
        var req = this.getReq();
        StickerModel.findOne({_id: id}, function (err, doc) {
            if (err) {
                return callback(err);
            }
            if (!doc) {
                return callback(new Error('Row not found'));
            }
            doc.remove(callback)
        })
    }
}, service);