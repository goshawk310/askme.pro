'use strict';
var QuestionModel = require('../models/question'),
    UserModel = require('../models/user'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    redisClient = require('../lib/redis').client,
    FileUpload = require('../lib/file/upload'),
    validator = require('validator'),
    blockedWords = require('../lib/blockedWords'),
    questionService = require('./question');

module.exports = _.defaults({
    getUnposted: function getUnposted (params, callback) {
        var req = this.getReq();
        QuestionModel.findOne({
            to: params.to,
            mode: 'post',
            contents: 'post',
            answer: null
        }).exec(function (err, post) {
            if (err) {
                return callback(err);
            }
            if (!post) {
                post = new QuestionModel();
                post.set({
                    to: params.to,
                    from: params.to,
                    contents: 'post',
                    mode: 'post',
                    ip: req.ip,
                });
                post.save(function (err, doc) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, doc);
                });
                return;
            } else {
                return callback(null, post);    
            }
        });
    },
    uploadImage: function (params, callback) {
        var self = this,
            server = this.getServer(),
            req = this.getReq(),
            res = this.getRes();
        this.getUnposted({
            to: params.to
        }, function (err, post) {
            questionService
                .setServer(server)
                .setReq(req)
                .setRes(res)
                .uploadImage({
                    id: post.id,
                    to: post.to
                });
        });
    },
    add: function add(params, callback) {
        var req = this.getReq();
        this.getUnposted({
            to: params.to
        }, function (err, post) {
            if (err) {
                return callback(err);
            }
            post.answer = params.contents;
            if (req) {
                post.a_ip = req.ip;
            }
            post.answered_at = new Date();
            post.save(function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    },
    /**
     * 
     * @param  {Object}   params
     * @param  {Function} callback
     * @return {void}
     */
    updateVideo: function updateVideo(params, callback) {
        var self = this;
        this.getUnposted({
            to: params.to
        }, function (err, post) {
            questionService
                .updateVideo({
                    id: post.id,
                    to: post.to,
                    yt_video: params.yt_video
                }, callback);
        });
    }
}, require('../lib/service'));