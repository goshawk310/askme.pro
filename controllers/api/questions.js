'use strict';
var questionService = require('../../services/question'),
    likeService = require('../../services/like'),
    commentService = require('../../services/comment'),
    auth = require('../../lib/auth');

module.exports = function(server) {

    server.post('/api/questions', function(req, res) {
        questionService.setServer(server)
            .setReq(req).setRes(res)
            .ask(function (err, question) {
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
    server.patch('/api/questions/:id', auth.isAuthenticated, function (req, res) {
        questionService.setReq(req).setRes(res)
            .answer({
                to: req.user._id,
                id: req.param('id'),
                answer: req.body.answer
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
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.patch('/api/questions/:id/videos', auth.isAuthenticated, function (req, res) {
        questionService.setReq(req).setRes(res)
            .updateVideo({
                to: req.user._id,
                id: req.param('id'),
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

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.delete('/api/questions/:id', auth.isAuthenticated, function (req, res) {
        var where = {
            _id: req.param('id')
        };
        if (req.user.role !== 'admin') {
            where.to = req.user._id;
        }
        questionService.setReq(req).setRes(res)
            .remove(where, function (err) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    'status': 'success',
                    'message': res.__('Pytanie zostało usunięte')
                });
            });
    });

    server.get('/api/questions/:id/likes', function (req, res) {
        likeService.getByQuestionId({
            id: req.param('id')
        }, function (err, likes) {
            if (err) {
                return res.send(500, {
                    status: 'error',
                    message: res.__('Wystąpił nieoczekiwany błąd')
                });
            }
            res.send(likes);
        });
        
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.post('/api/questions/:id/likes', auth.isAuthenticated, function (req, res) {
        likeService
            .setReq(req)
            .setRes(res)
            .create({
                question_id: req.param('id'),
                to: req.body.to._id,
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
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.delete('/api/questions/:id/likes', auth.isAuthenticated, function (req, res) {
        likeService
            .setReq(req)
            .setRes(res)
            .remove({
                question_id: req.param('id'),
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
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.post('/api/questions/:id/comments', auth.isAuthenticated, function (req, res) {
        commentService
            .setReq(req)
            .create({
                question_id: req.param('id'),
                contents: req.body.contents,
                from: req.body.anonymous ? null : req.user._id
            }, function (err, comment) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    status: 'success',
                    comment: comment
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.get('/api/questions/:id/comments', auth.isAuthenticated, function (req, res) {
        commentService
            .setReq(req)
            .getForQuestion(function (err, comments) {
                if (err) {
                    return res.send(500, {
                        status: 'error',
                        message: res.__('Wystąpił nieoczekiwany błąd')
                    });
                }
                return res.send({
                    comments: comments
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.delete('/api/questions/:id/photos', auth.isAuthenticated, function (req, res) {
        questionService
            .removeImage({
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
                });
            });
    });

    /**
     * 
     * @param  {Object} req
     * @param  {Object} res
     * @return {void}
     */
    server.delete('/api/questions/:id/videos', auth.isAuthenticated, function (req, res) {
        questionService
            .removeVideo({
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
                });
            });
    });
};
