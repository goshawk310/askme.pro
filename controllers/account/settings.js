'use strict';
var auth = require('../../lib/auth')(),
    captcha = require('easy-captcha'),
    check = require('validator').check,
    userService = require('../../services/user'),
    UserModel = require('../../models/user'),
    StickerModel = require('../../models/sticker'),
    _ = require('underscore');

module.exports = function (server) {
    
    server.get('/account/settings', auth.isAuthenticated, function (req, res) {
        StickerModel.find({}, function (err, stickers) {
            res.render('account/settings', {
                stickers: stickers
            });
        }); 
    });

    server.post('/account/settings', auth.isAuthenticated, function (req, res) {
        userService.setReq(req).setRes(res)
            .updatePrimaryData(req.user._id, req.body, function (err, req, res) {
                if (err) {
                    return res.send({
                        status: 'error',
                        message: res.__('Wystąpił błąd podczas aktualizacji danych.')
                    });
                }
                res.send({
                    status: 'success',
                    message: res.__('Dane zostały zaktualizowane pomyślnie.')
                });
            });
    });

    server.post('/account/settings/avatar', auth.isAuthenticated, function (req, res) {
        userService.changeAvatar(server, req, res);
    });

    server.post('/account/settings/password', auth.isAuthenticated, function (req, res) {
        userService.setReq(req).setRes(res)
            .changePassword(req.user._id, req.body, function (err, req, res) {
                if (err) {
                    return res.send({
                        status: 'error',
                        message: res.__('Wystąpił błąd podczas zmiany hasła.')
                    });
                }
                res.send({
                    status: 'success',
                    message: res.__('Hasło zostało zaktualizowane pomyślnie.')
                });
            });
    });

    server.post('/account/settings/profile', auth.isAuthenticated, function (req, res) {
        userService.setReq(req).setRes(res).updateProfileData(req.user._id, req.body, function (err, req, res) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: res.__('Wystąpił błąd podczas aktualizacji danych.')
                });
            }
            res.send({
                status: 'success',
                message: res.__('Dane zostały zaktualizowane pomyślnie.')
            });
        });
    });

    server.get('/account/settings/background', auth.isAuthenticated, function (req, res) {
        require('fs').readdir(server.locals.config.predefined_background.dir, function (err, files) {
            if (err) {
                return res.send([]);    
            }
            var prepared = [],  
                i = 0;
            if (req.user.custom_background) {
                prepared.push({
                    url: server.locals.config.custom_background.url + req.user.custom_background,
                    file: req.user.custom_background,
                    type: 'custom'
                });
            }
            for (i = 0; i < files.length; i += 1) {
                prepared.push({
                    url: server.locals.config.predefined_background.url + files[i],
                    file: files[i],
                    type: 'predefined'
                });
            }    
            res.send(prepared);
        });
    });

    server.put('/account/settings/background', auth.isAuthenticated, function (req, res) {
        userService.setServer(server).setReq(req).setRes(res).updateBackground(req.user._id, req.body, function (err, req, res) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: res.__('Wystąpił błąd podczas aktualizacji danych.')
                });
            }
            res.send({
                status: 'success',
                message: res.__('Dane zostały zaktualizowane pomyślnie.')
            });
        });
    });

    server.put('/account/settings/custom_background', auth.isAuthenticated, function (req, res) {
        userService.setServer(server).setReq(req).setRes(res).changeCustomBackground();
    });

    /**
     * 
     * @param  {[type]} req
     * @param  {[type]} res
     * @return void
     */
    server.put('/account/settings/deactivate', auth.isAuthenticated, function (req, res) {
        userService.setServer(server).setReq(req).setRes(res).deactivate(req.user._id, function (err, req, res) {
            if (err) {
                req.flash('message', {
                    error: res.__('Wystąpił nieoczekiwany błąd.')
                });
                return res.redirect('/account/settings');
            }
            req.logout();
            req.flash('error', res.__('Konto zostało zdezaktywowane.'));
            res.redirect('/account/login');
        });
    });
};