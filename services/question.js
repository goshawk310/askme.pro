'use strict';
var QuestionModel = require('../models/question'),
    LikeModel = require('../models/like'),
    UserModel = require('../models/user'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    redisClient = require('../lib/redis').client,
    FileUpload = require('../lib/file/upload'),
    Email = require('../lib/email'),
    validator = require('validator');

module.exports = _.defaults({
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
        question.save(function (err, doc) {
            if (!err && String(doc.to) !== String(doc.from)) {
                UserModel.findById(doc.to, function (err, user) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (user.online) {
                        return;
                    }
                    var email = new Email();
                    email.setTemplate(res.locals.getLocale() + '/question', {}, function (err, html, text) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        this.setSubject(res.__('Otrzymałeś nowe pytanie na askme.pro!'))
                            .setTo(user.email)
                            .setHtml(html)
                            .send(function (err, msg) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                    });    
                });
            }
            callback(err, doc);
        });
    },
    /**
     * getUnansweredByUserId
     * @param  {String}   id
     * @param  {Function} callback
     * @return {void}
     */
    getUnansweredByUserId: function getUnansweredByUserId(id, limit, page, callback) {
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
                callback(null, questions);
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
            .findOne(params)
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
                    if (err || value.width > 5000 || value.height > 5000) {
                        thisObj.gmInstance = null;
                        delete thisObj.gmInstance;
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
                fileImage.quality(60, function (err) {
                    thisObj.gmInstance = null;
                    delete thisObj.gmInstance;
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
                if (err || !question) {
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
     * getAnswered
     * @param  {String}   id
     * @param  {Function} callback
     * @return {void}
     */
    getAnswered: function getAnswered(params, callback) {
        var skip = params.limit && params.page ? (params.limit) * params.page : null,
            limit = params.limit || null,
            where = {},
            blocked = null,
            $and = [{answered_at: {'$ne': null}}];
        if (_.isArray(params.to)) {
            where.to = {$in: params.to};
        } else if (_.isString(params.to) || _.isObject(params.to)) {
            where.to = params.to;
        }
        if (params.lastAnsweredAt && validator.validators.isDate(params.lastAnsweredAt)) {
            where.answered_at = {$lt: new Date(params.lastAnsweredAt)};
            skip = null;
        } else if (params.firstAnsweredAt && validator.validators.isDate(params.firstAnsweredAt)) {
            where.answered_at = {$gt: new Date(params.firstAnsweredAt)};
            skip = null;
            limit = null;
        }
        if (params.id) {
            where._id = params.id;
        }
        if (params.blocked && _.isArray(params.blocked) && params.blocked.length) {
            blocked = params.blocked;
        }
        if (blocked && blocked.length) {
            if (where.to) {
                where.to.$nin = blocked;
            } else {
                where.to = {
                    $nin: blocked
                };
            }
        }
        var obj = {};
        for (var i in where) {
            obj = {};
            obj[i] = where[i];
            $and.push(obj);
        }
        QuestionModel
            .find({'$and': $and})
            .populate('from', 'username avatar')
            .populate('to', 'username avatar settings.anonymous_disallowed')
            .sort({answered_at: -1})
            .skip(skip).limit(limit ? limit + 1 : null)
            .exec(function (err, questions) {
                if (err) {
                    return callback(err);
                }
                var output = [],
                    hasMore = questions.length > params.limit ? params.page + 1 : false,
                    questionsCount = 0,
                    index = 0,
                    isLikedByUser = function isLikedByUser(question) {
                        question = question.toObject();
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
                                } else {
                                    isLikedByUser(questions[index]);
                                }
                        });
                    };
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
                isLikedByUser(questions[0]);
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
    },
    /**
     * 
     * @param  {Object}   params
     * @param  {Function} callback
     * @return {void}
     */
    removeImage: function removeImage(params, callback) {
        QuestionModel
            .findOne(params)
            .exec(function (err, question) {
                if (err) {
                    return callback(err);
                }
                if (question === null) {
                    return callback(new Error('Question not found'));
                }
                question.image = null;
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
    removeVideo: function removeVideo(params, callback) {
        QuestionModel
            .findOne(params)
            .exec(function (err, question) {
                if (err) {
                    return callback(err);
                }
                if (question === null) {
                    return callback(new Error('Question not found'));
                }
                question.yt_video = null;
                question.save(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
            });
    },
    getAnsweredByUserFrom: function getAnsweredByUserFrom(params, callback) {
        var $and = [],
            limit = params.limit;
        $and.push({from: params.from});
        QuestionModel
            .find({'$and': $and})
            .populate('to', 'username avatar')
            .sort({answered_at: -1})
            .skip(0).limit(limit)
            .exec(callback);
    }
}, require('../lib/service'));