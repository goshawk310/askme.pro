'use strict';
var auth = require('../../../lib/auth'),
    userService = require('../../../services/user'),
    UserModel = require('../../../models/user');

module.exports = function(server) {

    server.get('/api/admin/users', auth.hasPrivilegesOf('admin'), function (req, res) {
        UserModel
        .find({})
        .limit(20)
        .exec(function (err, users) {
            res.send(users);
        });
    });

};