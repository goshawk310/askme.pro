'use strict';
var auth = require('../../lib/auth'),
    settingService = require('../../services/setting');

module.exports = function(server) {
    
    server.get('/admin/settings', auth.hasPrivilegesOf('admin'), function (req, res) {
        settingService.getAll(function (err, docs) {
            var settings = {};
            docs.forEach(function (doc) {
                settings[doc.key] = doc.value;
            });
            res.render('admin/settings', {
                data: settings
            });
        });
    });
};
