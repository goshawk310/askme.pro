'use strict';
var questionService = require('../services/question');

module.exports = function(server) {

    server.post('/question/ask', function(req, res) {
        questionService.setServer(server)
            .setReq(req).setRes(res)
            .ask(function (err, quesion) {
                if (err) {
                    return res.send({
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd!')
                    });
                }
                res.send({
                    status: 'success',
                    message: res.__('Pytanie zostało wysłane')
                });
            });
    });
};
