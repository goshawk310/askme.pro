'use strict';
var auth = require('../../../lib/auth'),
    adminUserService = require('../../../services/admin/user'),
    UserModel = require('../../../models/user');

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

};