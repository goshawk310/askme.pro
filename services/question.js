'use strict';
var QuestionModel = require('../models/question'),
    LikeModel = require('../models/like'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    redisClient = require('../lib/redis').client,
    FileUpload = require('../lib/file/upload');

module.exports = _.extend({
    ask: function ask(callback) {
        var req = this.getReq(),
            res = this.getRes(),
            data = req.body.question,
            question = new QuestionModel();
        question.set({
            to: mongoose.Types.ObjectId(data.to),
            contents: data.contents
        });
        if (Boolean(parseInt(data.anonymous, 10))) {
            question.from = null;
        } else {
            question.from = mongoose.Types.ObjectId(req.user.id)
        }
        question.save(callback);
    },
    /**
     * getUnansweredByUserId
     * @param  {String}   id
     * @param  {Function} callback
     * @return {void}
     */
    getUnansweredByUserId: function getUnansweredByUserId(id, countOverall, limit, page, callback) {
        var skip = limit * page;
        QuestionModel
            .find({to: id, answer: null})
            .populate('from', 'username avatar')
            .sort({_id: -1})
            .skip(skip).limit(limit)
            .exec(function (err, questions) {
                if (err) {
                    return callback(err);
                }
                var output = []
                _.each(questions, function (question) {
                    question = question.toObject();
                    question.created_at = question._id.getTimestamp();
                    output.push(question);
                });
                callback(null, output);
        });
    },
    /**
     * 
     * @param  {Object}   params
     * @param  {Function} callback
     * @return {void}
     */
    answer: function answer(params, callback) {
        QuestionModel
            .findOne({_id: params.id, to: params.to, answer: null})
            .exec(function (err, question) {
                if (err) {
                    return callback(err);
                }
                if (question === null) {
                    return callback(new Error('Question not found'));
                }
                question.answer = params.answer;
                question.answered_at = new Date();
                question.save(function (err) {
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
    remove: function remove(params, callback) {
        QuestionModel
            .findOne({_id: params.id, to: params.to})
            .exec(function (err, question) {
                if (err) {
                    return callback(err);
                }
                if (question === null) {
                    return callback(new Error('Question not found'));
                }
                question.remove(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            });
    },
    uploadImage: function uploadImage(params, callback) {
        var server = this.getServer(),
            req = this.getReq(),
            res = this.getRes(),
            upload = new FileUpload(req, res, {
            allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
            dir: server.locals.config.answer.dir,
            fileKey: 'image',
            preProcess: function preProcess(file, callback) {
                var thisObj = this,
                    FileImage = require('../lib/file/image'),
                    fileImage = new FileImage(file.path);
                fileImage.checkSize(function (err, value) {
                    if (err || value.width > 2000 || value.height > 2000) {
                        thisObj.clearAll();
                        return callback(new Error('Invalid image size.'), thisObj.req, thisObj.res);
                    } else {
                        thisObj.renameFile(file, callback);
                    }
                })
            },
            postProcess: function postProcess(filename, callback) {
                var thisObj = this,
                    FileImage = require('../lib/file/image'),
                    fileImage = new FileImage(filename);
                fileImage.quality(45, function (err) {
                    if (err) {
                        thisObj.clearAll();
                        return callback(new Error('Quality change error.'), thisObj.req, thisObj.res);
                    } else {
                        return callback(null, thisObj.req, thisObj.res, filename);
                    }
                })
            },
            renameToken: params.id
        });
        upload.one(function (err, req, res, filename) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: res.__('Wystąpił błąd podczas wgrywania zdjęcia.')
                });
            }
            QuestionModel.findOne({_id: params.id, to: params.to}, function(err, question) {
                if (err) {
                    return res.send({
                        status: 'error',
                        message: res.__('Wystąpił błąd podczas wgrywania zdjęcia.')
                    });
                }
                question.image = require('path').basename(filename);
                question.save(function (err) {
                    if (err) {
                        upload.clearAll();
                        return res.send({
                            status: 'error',
                            message: res.__('Wystąpił błąd podczas wgrywania zdjęcia.')
                        });
                    }
                    return res.send({
                        status: 'success',
                        message: res.__('Zdjęcie wgrane pomyślnie.'),
                        filename: question.image
                    });
                });
            });
        });
    },
    /**
     * getAnsweredByUserId
     * @param  {String}   id
     * @param  {Function} callback
     * @return {void}
     */
    getAnswered: function getAnswered(params, callback) {
        var skip = (params.limit + 1) * params.page;
        QuestionModel
            .find({to: params.to, answer: {'$ne': null}})
            .populate('from', 'username avatar')
            .populate('to', 'settings.anonymous_disallowed')
            .sort({answered_at: -1})
            .skip(skip).limit(params.limit + 1)
            .exec(function (err, questions) {
                if (err) {
                    return callback(err);
                }
                var output = [],
                    hasMore = questions.length > params.limit ? params.page + 1 : false,
                    questionsCount = 0,
                    index = 0;
                if (hasMore) {    
                    questions.pop();
                }
                questionsCount = questions.length;
                if (!questionsCount) {
                    return callback(null, {
                        questions: [],
                        hasMore: false
                    });
                }
                _.each(questions, function (question) {
                    question = question.toObject();
                    question.created_at = question._id.getTimestamp();
                    (function (question) {
                        LikeModel
                            .findOne({question_id: question._id, from: params.from})
                            .exec(function (err, like) {
                                if (!err && like) {
                                    question.liked = like._id;
                                } else {
                                    question.liked = false;
                                }
                                output.push(question);
                                index += 1;
                                if (index === questionsCount) {
                                    return callback(null, {
                                        questions: output,
                                        hasMore: hasMore
                                    });
                                }
                        });
                    }(question));
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
        QuestionModel
            .findOne({_id: params.id, to: params.to, answer: null})
            .exec(function (err, question) {
                if (err) {
                    return callback(err);
                }
                if (question === null) {
                    return callback(new Error('Question not found'));
                }
                question.yt_video = params.yt_video;
                question.save(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            });
    }
}, require('../lib/service'));