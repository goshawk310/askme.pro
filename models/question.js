'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    UserModel = require('./user');

var Question = function Question() {

    var schema = mongoose.Schema({
        to: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
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
        if (pattern.test(question.contents)) {
            next(new Error('Banned word occurred'));
        } else {
            next();
        }
    });

    /**
     * post save
     * @return void
     */
    schema.post('save', function() {
        var question = this;
        if (question.answer === null) {
            UserModel.update({
                _id: question.to
            }, {
                $inc: {'stats.questions_unread': 1}
            }, function (err, user) {
            
            });
        }
    });

    return mongoose.model('Question', schema);
};

module.exports = new Question();
