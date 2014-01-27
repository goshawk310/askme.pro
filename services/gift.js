'use strict';
var GiftModel = require('../models/gift'),
    UserGiftModel = require('../models/user/gift'),
    mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = _.extend({
    getAll: function getAll(callback) {
        GiftModel
            .find()
            .exec(callback);
    },
    send: function send(callback) {
        var req = this.getReq(),
            userGift = new UserGiftModel({
                gift: req.param('id'),
                to: req.body.to,
                from: req.user._id,
                type: req.body.type
            });
        if (req.user.points < 20) {
            return callback(new Error('Insufficient number of points'));
        }
        userGift.save(callback);
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