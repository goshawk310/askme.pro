'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    QuestionModel = require('./question'),
    UserModel = require('./user'),
    ioHelper = require('../lib/socket.io');

var Comment = function() {

    var schema = mongoose.Schema({
        created_at: {
            type: Date,
            default: Date.now,
            required: true
        },
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Question',
            index: true
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User'
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User'
        },
        contents: {
            type: String,
            required: true,
            validate: [validate('len', 1, 200)]
        },
        viewed: {
            type: Boolean,
            default: false
        }
    }, {
        collection: 'comments',
        autoIndex: false
    });

    /**
     * pre save
     * @param  {Function} next
     * @return void
     */
    schema.pre('validate', function(next) {
        next();
    });
    
    /**
     * pre save
     * @param  {Function} next
     * @return void
     */
    schema.pre('save', function(next) {
        this.wasNew = this.isNew;
        next();
    });

    /**
     * post init middleware 
     * @return {void}
     */
    schema.post('init', function() {
        this._original = this.toObject();
    });

    /**
     * post save middleware
     * @return {void}
     */
    schema.post('save', function(comment) {
        if (this.wasNew) {
            QuestionModel.update({
                _id: comment.question_id
            }, {
                $inc: {'stats.comments': 1}
            }, function (err, user) {
            
            });
            QuestionModel.findOne({
                _id: comment.question_id
            }, function (err, question) {
                if (!err && question &&  question.to.toString() !== comment.from.toString()) {
                    UserModel.update({
                        _id: question.to
                    }, {
                        $inc: {'notifications.comments': 1}
                    }, function (err, user) {
                    
                    });
                    comment.update({
                        $set: {to: question.to}
                    }, function () {
                    
                    });
                    ioHelper.io().sockets.socket(ioHelper.getSocketId(question.to)).emit('feed', {
                        type: 'comment'
                    });
                }
            });
        }
    });

    /**
     * post remove middleware
     * @return {void}
     */
    schema.post('remove', function(comment) {
        QuestionModel.update({
            _id: comment.question_id
        }, {
            $inc: {'stats.comments': -1}
        }, function (err, user) {
        
        });
    });

    return mongoose.model('Comment', schema);
};

module.exports = new Comment();
