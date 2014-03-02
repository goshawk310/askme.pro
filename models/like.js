'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    QuestionModel = require('./question'),
    UserModel = require('./user'),
    ioHelper = require('../lib/socket.io');

var Like = function() {

    var schema = mongoose.Schema({
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Question',
            index: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        viewed: {
            type: Boolean,
            default: false
        },
        sync: {
            id: {
                type: Number,
                required: false,
                index: {unique: true, sparse: true}
            }
        }
    }, {
        collection: 'likes',
        autoIndex: false
    });
    
    schema.index({question_id: 1, from: 1}, {unique: true});
    
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
    schema.post('save', function(like) {
        if (this.wasNew) {
            QuestionModel.update({
                _id: like.question_id
            }, {
                $inc: {'stats.likes': 1}
            }, function (err, user) {
            
            });
            UserModel.update({
                _id: like.to
            }, {
                $inc: {
                    'stats.likes': 1,
                    'notifications.likes': 1
                }
            }, function (err, user) {
            
            });
            var io = ioHelper.io();
            if (io) {
                io.sockets.socket(ioHelper.getSocketId(like.to)).emit('likes', {
                    id: like.question_id
                });
            }
        }
    });

    /**
     * post remove middleware
     * @return {void}
     */
    schema.post('remove', function(like) {
        QuestionModel.update({
            _id: like.question_id
        }, {
            $inc: {'stats.likes': -1}
        }, function (err, user) {
        
        });
        UserModel.update({
            _id: like.to
        }, {
            $inc: {'stats.likes': -1}
        }, function (err, user) {
        
        });
    });

    return mongoose.model('Like', schema);
};

module.exports = new Like();
