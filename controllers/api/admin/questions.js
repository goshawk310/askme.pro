'use strict';
var auth = require('../../../lib/auth'),
    questionOfTheDay = require('../../../services/question/ofTheDay');

module.exports = function(server) {
    
    server.post('/api/admin/questions/of-the-day', auth.hasPrivilegesOf('editor'), function (req, res) {
        questionOfTheDay
        .setReq(req)
        .ask(function (err) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: err
                });
            }
            return res.send({
                status: 'success',
                message: res.__('Pytanie dnia zostało zapisane')
            });
        });
    });

};
