'use strict';
var GiftModel = require('../models/gift'),
    UserModel = require('../models/user'),
    UserGiftModel = require('../models/user/gift'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    Email = require('../lib/email');

module.exports = _.defaults({
    getAll: function getAll(callback) {
        GiftModel
            .find()
            .exec(callback);
    },
    send: function send(callback) {
        var req = this.getReq(),
            res = this.getRes(),
            userGift = new UserGiftModel({
                gift: req.param('id'),
                to: req.body.to,
                from: req.user._id,
                type: req.body.type
            });
        if (req.user.points < 20) {
            return callback(new Error('Insufficient number of points'));
        }
        userGift.save(function(err) {
            if (err) {
                return callback(err);
            }
            UserModel.findOne({
                _id: req.body.to
            }, function (err, doc) {
                if (err || !doc) {
                    return;
                }
                var email = new Email();
                email.setTemplate(res.locals.getLocale() + '/gift', {
                    username: doc.username
                }, function (err, html, text) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    this.setSubject(res.__('Ktoś podarował Ci gifta na askme.pro!'))
                        .setTo(doc.email)
                        .setHtml(html)
                        .send(function (err, msg) {
                            if (err) {
                                console.log(err);
                            }
                        });
                });
            });
            callback(err);
        });
    },
    updatePosition: function updatePosition(id, to, position, bounds, callback) {
        UserGiftModel.
            update({
                _id: id,
                to: to
            }, {
                $set: {
                    pos: position,
                    bounds: bounds
                }
            }, callback);
    }
}, require('../lib/service'));