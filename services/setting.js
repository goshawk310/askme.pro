'use strict';
var SettingModel = require('../models/setting'),
    mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = _.defaults({
    getAll: function getAll(callback) {
        SettingModel
            .find()
            .exec(callback);
    },
    save: function save(callback) {
        var req = this.getReq();
        SettingModel
            .findOne({key: req.body.setting.key})
            .exec(function (err, setting) {
                if (err) {
                    return callback(err);
                }
                if (setting === null) {
                    setting = new SettingModel();
                    setting.key = req.body.setting.key;
                }
                setting.value = req.body.setting.value;
                setting.save(callback);
            });
    },
    getByKey: function getByKey(key, callback) {
        SettingModel
            .findOne({key: key})
            .exec(callback);
    }
}, require('../lib/service'));