'use strict';
var auth = require('../../../lib/auth'),
    adminUserService = require('../../../services/admin/user'),
    adminQuestionService = require('../../../services/admin/question'),
    adminGiftService = require('../../../services/admin/gift'),
    adminCommentService = require('../../../services/admin/comment'),
    adminLikeService = require('../../../services/admin/like');

module.exports = function(server) {

    server.get('/api/admin/users', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminUserService
        .setReq(req)
        .getUsers(function (err, rows, total) {
            res.send({
                total: total,
                rows: rows
            });
        });
    });

    server.patch('/api/admin/users/:id', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminUserService
        .setReq(req)
        .setRes(res)
        .patch(req.param('id'), function (err) {
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

    server.delete('/api/admin/users/:id', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminUserService
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

    server.delete('/api/admin/users/:id/answers', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminQuestionService
        .removeAllTo(req.param('id'), function (err, count) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1,
                message: count
            });
        });
    });

    server.delete('/api/admin/users/:id/questions', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminQuestionService
        .removeAllFrom(req.param('id'), function (err, count) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1,
                message: count
            });
        });
    });

    server.delete('/api/admin/users/:id/gifts/recived', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminGiftService
        .removeAllTo(req.param('id'), function (err, count) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1,
                message: count
            });
        });
    });

    server.delete('/api/admin/users/:id/gifts/sent', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminGiftService
        .removeAllFrom(req.param('id'), function (err, count) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1,
                message: count
            });
        });
    });

    server.delete('/api/admin/users/:id/comments/recived', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminCommentService
        .removeAllTo(req.param('id'), function (err, count) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1,
                message: count
            });
        });
    });

    server.delete('/api/admin/users/:id/comments/sent', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminCommentService
        .removeAllFrom(req.param('id'), function (err, count) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1,
                message: count
            });
        });
    });

    server.delete('/api/admin/users/:id/likes/recived', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminLikeService
        .removeAllTo(req.param('id'), function (err, count) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1,
                message: count
            });
        });
    });

    server.delete('/api/admin/users/:id/likes/sent', auth.hasPrivilegesOf('moderator'), function (req, res) {
        adminLikeService
        .removeAllFrom(req.param('id'), function (err, count) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err
                });
            }
            return res.send({
                status: 1,
                message: count
            });
        });
    });
};