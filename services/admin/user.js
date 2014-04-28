'use strict';
var UserModel = require('../../models/user'),
    service = require('../../lib/service'),
    _ = require('underscore'),
     fsExtra = require('fs-extra'),
    config = require('../../config/app'),
    path = require('path');

module.exports = _.extend({
    countAll: function countAll(callback) {
        UserModel.count({}, callback);
    },
    getUsers: function getUsers(callback) {
        var req = this.getReq(),
            whereOr = [],
            conds = {},
            thisObj = this;
        if (req.param('query')) {
            whereOr.push({username: {$regex: new RegExp('^' + req.param('query') + '$', 'i')}});
        }
        if (whereOr.length) {
            conds.$or = whereOr;
        }
        UserModel.count(conds, function (err, total) {
            thisObj.paginate(UserModel.find(conds))
            .exec(function (err, rows) {
                callback(err, rows, total);
            });
        })    
    },
    patch: function patch(id, callback) {
        var req = this.getReq();
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return callback(err);
            }
            if (!user || user._id === req.user._id) {
                return callback(new Error('User not found'));
            }
            user.set(req.body);
            user.save(callback)
        })
    },
    remove: function remove(id, callback) {
        var req = this.getReq();
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return callback(err);
            }
            if (!user || user._id === req.user._id) {
                return callback(new Error('User not found'));
            }
            user.remove(callback)
        });
    },
    removeTopBg: function removeTopBg(id, callback) {
        var req = this.getReq();
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback(new Error('Document not found'));
            }
            console.log(config);
            if (user.top_bg) {
                fsExtra.remove(config.topbg.dir + user.top_bg, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    user.set({
                        top_bg: null
                    });
                    user.save(callback);
                });
                
            } else {
                callback(new Error('No top background set'));
            }
        });
    },
    removeCustomBg: function removeCustomBg(id, callback) {
        var req = this.getReq();
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback(new Error('Document not found'));
            }
            if (user.custom_background) {
                fsExtra.remove(config.custom_background.dir + user.custom_background, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    user.set({
                        custom_background: null,
                        background: null
                    });
                    user.save(callback);
                });
            } else {
                callback(new Error('No custom background set'));
            }
        });
    },
    removeAvatar: function removeAvatar(id, callback) {
        var req = this.getReq();
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback(new Error('Document not found'));
            }
            if (user.avatar) {
                fsExtra.remove(config.avatar.dir + user.avatar, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    fsExtra.remove(config.avatar.dir + user.avatar.replace(path.extname(user.avatar), ''));
                    user.set({
                        avatar: null
                    });
                    user.save(callback);
                });
            } else {
                callback(new Error('No custom background set'));
            }
        });
    }
}, service);