'use strict';
var auth = require('../../../lib/auth'),
    settingService = require('../../../services/setting');

module.exports = function(server) {
    
    server.put('/api/admin/settings', auth.hasPrivilegesOf('admin'), function (req, res) {
        settingService
            .setReq(req)
            .save(function (err) {
                 if (err) {
                    return res.send({
                        status: 'error',
                        message: err
                    });
                }
                return res.send({
                    status: 'success',
                    message: res.__('Ustawienie zostało zapisane')
                });
            });
    });
};
