'use strict';
var auth = require('../../../lib/auth'),
    adminStickerService = require('../../../services/admin/sticker');

module.exports = function(server) {

    server.get('/api/admin/stickers', auth.hasPrivilegesOf('admin'), function (req, res) {
        adminStickerService
        .setReq(req)
        .get(function (err, rows, total) {
            res.send({
                total: total,
                rows: rows
            });
        });
    });

    server.delete('/api/admin/stickers/:id', auth.hasPrivilegesOf('admin'), function (req, res) {
        adminStickerService
        .setReq(req)
        .remove(req.param('id'), function (err) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1
            });
        });
    });
};