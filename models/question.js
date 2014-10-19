'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    fsExtra = require('fs-extra'),
    config = require('../config/app'),
    blockedWords = require('../lib/blockedWords'),
    ioHelper = require('../lib/socket.io');

var Question = function Question() {

    var schema = mongoose.Schema({
        created_at: {
            type: Date,
            default: Date.now
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'User',
            index: true
        },
        og_from: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'User'
        },
        contents: {
            type: String,
            required: true,
            validate: [validate('len', 1, 200)]
        },
        answer: {
            type: String,
            required: false,
            default: null
        },
        answered_at: {
            type: Date,
            required: false,
            default: null,
            index: true
        },
        image: {
            type: String,
            required: false,
            default: null
        },
        yt_video: {
            type: String,
            required: false,
            default: null
        },
        stats: {
            likes: {
                type: Number,
                default: 0
            },
            comments: {
                type: Number,
                default: 0
            }
        },
        qday_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'QuestionOfTheDay',
            index: true
        },
        ip: {
            type: String,
            required: false,
            default: null
        },
        a_ip: {
            type: String,
            required: false,
            default: null
        },
        sync: {
            id: {
                type: Number,
                index: {unique: true, sparse: true}
            },
            image: {
                type: Boolean,
                default: false
            }
        },
        random_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: 'QuestionRandom'
        },
        mode: {
            type: String,
            enum: ['question', 'post'],
            default: 'question'
        }
    }, {
        collection: 'questions',
        autoIndex: false
    });
    
    /**
     * pre save
     * @param  {Function} next
     * @return void
     */
    schema.pre('save', function(next) {
        var question = this;
        this.wasNew = this.isNew;
        if (this.isNew) {
            blockedWords.test(question.contents, question.to, next);
        } else {
            next();
        }
    });

    schema.post('init', function() {
        this._original = this.toObject();
    });

    /**
     * post save
     * @return void
     */
    schema.post('save', function(question) {
        var UserModel = require('./user');
        if (this.mode === 'post') {
            if (this.answer !== null) {
                UserModel.update({
                    _id: question.to
                }, {
                    $inc: {'stats.posts': 1}
                }, function (err, user) {
                
                });
            }
            return;
        }
        if (this.sync && this.sync.id) {
            if (this.answer === null) {
                UserModel.update({
                    _id: question.to
                }, {
                    $inc: {'stats.questions_unanswered': 1}
                }, function (err, user) {
                
                });
            } else {
                UserModel.update({
                    _id: question.to
                }, {
                    $inc: {
                        'stats.questions_answered': 1
                    }
                }, function (err, user) {
                    
                });
            }
            return;
        }
        if (this.wasNew) {
            UserModel.update({
                _id: question.to
            }, {
                $inc: {'stats.questions_unanswered': 1}
            }, function (err, user) {
            
            });
            /*var io = ioHelper.io();
            if (io) {
                io.sockets.socket(ioHelper.getSocketId(question.to)).emit('questions', {
                    id: question._id
                });
            }*/
        } else if (this._original && this._original.answer === null && this.answer !== null) {
            UserModel.update({
                _id: question.to
            }, {
                $inc: {
                    'stats.questions_unanswered': -1,
                    'stats.questions_answered': 1,
                    points: (question.to !== question.from) ? 0.2 : 0
                }
            }, function (err, user) {
                
            });
            if (question.from && question.from.toString() !== question.to.toString()) {
                UserModel.update({
                    _id: question.from
                }, {
                    $inc: {
                        'notifications.answers': 1
                    }
                }, function (err, user) {
                    
                });
                /*var io = ioHelper.io();
                if (io) {
                    io.sockets.socket(ioHelper.getSocketId(question.from)).emit('feed', {
                        type: 'answer'
                    });
                }*/
            }
        } else if (this._original && this._original.image !== null && this.image === null) {
            fsExtra.remove(config.answer.dir + this._original.image);
        }
    });

    /**
     * post remove
     * @return void
     */
    schema.post('remove', function(question) {
        var UserModel = require('./user'),
            CommentModel = require('./comment'),
            LikeModel = require('./like');
        if (this.mode === 'post') {
            UserModel.update({
                _id: question.to
            }, {
                $inc: {'stats.posts': -1}
            }, function (err, user) {
            
            });
            return;
        }    
        if (question.answer === null) {
            UserModel.update({
                _id: question.to
            }, {
                $inc: {'stats.questions_unanswered': -1}
            }, function (err, user) {
            
            });
        } else {
            UserModel.update({
                _id: question.to
            }, {
                $inc: {
                    'stats.questions_answered': -1,
                    'stats.likes': -question.stats.likes
                }
            }, function (err, user) {
            
            });
            CommentModel.remove({
                question_id: question._id
            }, function (err) {
               
            });
            LikeModel.remove({
                question_id: question._id
            }, function (err) {
               
            });
        }
        if (question.image !== null) {
            fsExtra.remove(config.answer.dir + question.image);
        }
    });
    
    schema.statics.removeAllTo = function removeAllTo(id, callback) {
        this.find({to: id}, function (err, docs) {
            if (err) {
                return callback(err);
            }
            var all = docs.length,
                i = 0;
            if (!all) {
                return callback(null);
            }
            docs.forEach(function (doc) {
                doc.remove(function (err) {
                    i += 1;
                    if (err) {
                        console.log(err);
                    }
                    if (i >= all) {
                        return callback(null, all);
                    }
                });
            });
        });
    };

    schema.statics.removeAllFrom = function removeAllFrom(id, callback) {
        this.find({$or: [{from: id}, {og_from: id}]}, function (err, docs) {
            if (err) {
                return callback(err);
            }
            var all = docs.length,
                i = 0;
            if (!all) {
                return callback(null);
            }
            docs.forEach(function (doc) {
                doc.remove(function (err) {
                    i += 1;
                    if (err) {
                        console.log(err);
                    }
                    if (i >= all) {
                        return callback(null, all);
                    }
                });
            });
        });
    };

    return mongoose.model('Question', schema);
};

module.exports = new Question();
