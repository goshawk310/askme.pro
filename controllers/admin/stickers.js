'use strict';
var auth = require('../../lib/auth'),
    adminUserService = require('../../services/admin/user');

module.exports = function(server) {
    
    server.get('/admin/stickers', auth.hasPrivilegesOf('admin'), function (req, res) {
        res.render('admin/stickers', {
            title: res.__('Wstążki')
        });
    });
};
