'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
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
        var QuestionModel = require('./question'),
            UserModel = require('./user');
    
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
                if (!err && question && (!comment.from || question.to.toString() !== comment.from.toString())) {
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
                    /*ioHelper.io().sockets.socket(ioHelper.getSocketId(question.to)).emit('feed', {
                        type: 'comment'
                    });*/
                }
            });
        }
    });

    /**
     * post remove middleware
     * @return {void}
     */
    schema.post('remove', function(comment) {
        var QuestionModel = require('./question');
        QuestionModel.update({
            _id: comment.question_id
        }, {
            $inc: {'stats.comments': -1}
        }, function (err, user) {
        
        });
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
        this.find({from: id}, function (err, docs) {
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
    
    return mongoose.model('Comment', schema);
};

module.exports = new Comment();
