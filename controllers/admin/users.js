'use strict';
var auth = require('../../lib/auth'),
    adminUserService = require('../../services/admin/user');

module.exports = function(server) {
    
    server.get('/admin/users', auth.hasPrivilegesOf('moderator'), function (req, res) {
        res.render('admin/users', {
            title: res.__('Użytkownicy')
        });
    });

    server.get('/admin/users/images', auth.hasPrivilegesOf('moderator'), function (req, res) {
        res.render('admin/users/images');
    });
};
