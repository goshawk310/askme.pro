'use strict';
var StickerModel = require('../../models/sticker'),
    service = require('../../lib/service'),
    _ = require('underscore'),
    FileUpload = require('../../lib/file/upload');

module.exports = _.extend({
    get: function get(callback) {
        var req = this.getReq(),
            thisObj = this,
            conds = {};
        StickerModel.count(conds, function (err, total) {
            thisObj.paginate(StickerModel.find(conds), function (query) {
                if (!req.param('sort_by')) {
                    query.sort({_id: -1});
                }
                return query;
            })
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
    },
    add: function add(callback) {
        var server = this.getServer(),
            req = this.getReq(),
            res = this.getRes(),
            upload = new FileUpload(req, res, {
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
                dir: server.locals.config.sticker.dir,
                fileKey: 'file'
            });
        upload.one(function (err, req, res, filename) {
            if (err) {
                return callback(err)
            }
            var sticker = new StickerModel({
                name: req.body.name,
                file: require('path').basename(filename)
            });
            sticker.save(callback);
        });
    }
}, service);