'use strict';
var giftService = require('../../services/gift'),
    auth = require('../../lib/auth');

module.exports = function(server) {

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/gifts', auth.isAuthenticated, function (req, res) {
        giftService
            .getAll(function (err, gifts) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send(gifts);
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.post('/api/gifts/:id/send', auth.isAuthenticated, function (req, res) {
        giftService
            .setReq(req)
            .setRes(res)
            .send(function (err, gift) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    status: 'success',
                    message: res.__('Gift został wysłany')
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.patch('/api/gifts/:id/position', auth.isAuthenticated, function (req, res) {
        giftService
            .setReq(req)
            .updatePosition(req.param('id'), req.user._id, req.body.position, req.body.bounds, function (err, gift) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    status: 'success',
                    gift: gift
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/:id/gifts', auth.isAuthenticated, function (req, res) {
        giftService
            .setReq(req)
            .getByUserId(req.param('id'), req.user._id, req.body.position, req.body.bounds, function (err, gift) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    status: 'success',
                    gift: gift
                });
            });
    });
};
