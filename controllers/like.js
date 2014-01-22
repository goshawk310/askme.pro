'use strict';
var likeService = require('../services/like'),
    auth = require('../lib/auth');

module.exports = function(server) {

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.post('/like', auth.isAuthenticated, function (req, res) {
        likeService
            .setReq(req)
            .setRes(res)
            .create({
                question_id: req.body.question_id,
                to: req.body.to,
                from: req.user._id
            }, function (err, like) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    'status': 'success',
                    'message': '',
                    'id': like._id
                })
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.delete('/like/:id', auth.isAuthenticated, function (req, res) {
        likeService
            .setReq(req)
            .setRes(res)
            .remove({
                _id: req.param('id'),
                from: req.user._id
            }, function (err) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    'status': 'success',
                    'message': ''
                })
            });
    });

};
