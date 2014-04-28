'use strict';
var auth = require('../../../lib/auth'),
    questionOfTheDay = require('../../../services/question/ofTheDay'),
    adminQuestionService = require('../../../services/admin/question');

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

    server.get('/api/admin/questions', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminQuestionService
        .setReq(req)
        .getQuestions(function (err, rows, total) {
            res.send({
                total: total,
                rows: rows
            });
        });
    });

    server.delete('/api/admin/questions/:id', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminQuestionService
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
