'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    UserModel = require('./user'),
    fsExtra = require('fs-extra'),
    config = require('../config/app');

var Question = function Question() {

    var schema = mongoose.Schema({
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
            default: null
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
        var question = this,
            blockedWords = ['chuj', 'cipa', 'dupa', 'kurwa', 'bladź'],
            pattern = new RegExp(blockedWords.join('|'), 'i');
        this.wasNew = this.isNew;    
        if (pattern.test(question.contents) || (question.answer !== null && pattern.test(question.answer))) {
            next(new Error('Banned word occurred'));
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
        if (this.wasNew) {
            UserModel.update({
                _id: question.to
            }, {
                $inc: {'stats.questions_unanswered': 1}
            }, function (err, user) {
            
            });
        } else if (this._original.answer === null && this.answer !== null) {
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
        }
    });

    /**
     * post remove
     * @return void
     */
    schema.post('remove', function(question) {
        if (question.answer === null) {
            UserModel.update({
                _id: question.to
            }, {
                $inc: {'stats.questions_unanswered': -1}
            }, function (err, user) {
            
            });
        }
        if (question.image !== null) {
            fsExtra.remove(config.answer.dir + question.image);
        }
    });

    return mongoose.model('Question', schema);
};

module.exports = new Question();
