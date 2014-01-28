'use strict';
var userService = require('../../services/user'),
    auth = require('../../lib/auth');

module.exports = function(server) {

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/users/:username/gifts', function (req, res, next) {
        userService
            .setReq(req)
            .setRes(res)
            .setNext(next);
        userService.getByUsername(req.param('username'), function(err, user, next) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next();
            }
            if (!req.isAuthenticated() && user.settings.anonymous_disallowed) {
                return res.send(503, {});
            }
            userService
                .getGiftsById(user._id, {limit: 18, page: Math.abs(parseInt(req.param('page'), 10))}, function (err, gifts) {
                    if (err) {
                        return res.send(500, {
                            status: 'error',
                            message: res.__('Wystąpił nieoczekiwany błąd')
                        });
                    }
                    return res.send(gifts);
                });
        });
    });
};
