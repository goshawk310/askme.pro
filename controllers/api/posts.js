'use strict';
var postService = require('../../services/post'),
    auth = require('../../lib/auth');

module.exports = function(server) {
    
    server.post('/api/posts/image', auth.isAuthenticated, function (req, res) {
        postService
            .setServer(server)
            .setReq(req)
            .setRes(res)
            .uploadImage({
                to: req.user._id
            });
    });

    server.post('/api/posts/video', auth.isAuthenticated, function (req, res) {
        postService.setReq(req).setRes(res)
            .updateVideo({
                to: req.user._id,
                yt_video: req.body.yt_video
            }, function (err) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    'status': 'success',
                    'message': res.__('Wideo zostało zapisane')
                });
            });    
    });

    server.post('/api/posts', auth.isAuthenticated, function (req, res) {
        postService
            .setReq(req)
            .add({
                to: req.user._id,
                contents: req.body.post.contents
            }, function (err, post) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd!')
                    });
                }
                res.send({
                    status: 'success',
                    message: res.__('Wiadomość została wysłana')
                });
            });
    });
};