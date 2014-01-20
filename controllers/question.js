'use strict';
var questionService = require('../services/question'),
    auth = require('../lib/auth');

module.exports = function(server) {

    server.post('/question/ask', function(req, res) {
        questionService.setServer(server)
            .setReq(req).setRes(res)
            .ask(function (err, quesion) {
                if (err) {
                    return res.send(500, {
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


    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.patch('/question/:id', auth.isAuthenticated, function (req, res) {
        questionService.setReq(req).setRes(res)
            .answer({
                to: req.user._id, id: req.param('id'), answer: req.body.answer
            }, function (err) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    'status': 'success',
                    'message': res.__('Odpowiedź została zapisana')
                })
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.delete('/question/:id', auth.isAuthenticated, function (req, res) {
        questionService.setReq(req).setRes(res)
            .remove({
                to: req.user._id, id: req.param('id')
            }, function (err) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    'status': 'success',
                    'message': res.__('Pytanie zostało usunięte')
                })
            });
    });

};
