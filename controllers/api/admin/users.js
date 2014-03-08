'use strict';
var auth = require('../../../lib/auth'),
    adminUserService = require('../../../services/admin/user'),
    adminQuestionService = require('../../../services/admin/question');

module.exports = function(server) {

    server.get('/api/admin/users', auth.hasPrivilegesOf('admin'), function (req, res) {
        adminUserService
        .setReq(req)
        .getUsers(function (err, rows, total) {
            res.send({
                total: total,
                rows: rows
            });
        });
    });

    server.patch('/api/admin/users/:id', auth.hasPrivilegesOf('admin'), function (req, res) {
        adminUserService
        .setReq(req)
        .setRes(res)
        .patch(req.param('id'), function (err) {
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

    server.delete('/api/admin/users/:id/answers', auth.hasPrivilegesOf('admin'), function (req, res) {
        adminQuestionService
        .setReq(req)
        .setRes(res)
        .deleteAllTo(req.param('id'), function (err, count) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1,
                message: count
            });
        });
    });
};