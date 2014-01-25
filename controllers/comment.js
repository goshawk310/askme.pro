'use strict';
var commentService = require('../services/comment'),
    auth = require('../lib/auth');

module.exports = function(server) {

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.delete('/comment/:id', auth.isAuthenticated, function (req, res) {
        var where = {
            _id: req.param('id')
        };
        if (req.user.role !== 'admin') {
            where.from = req.user._id;
        }
        commentService
            .remove(where,
            function (err) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    status: 'success',
                });
            });
    });
};
