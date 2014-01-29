'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    UserModel = require('../user');

var UserGift = function() {

    var schema = mongoose.Schema({
        created_at: {
            type: Date,
            required: true
        },
        gift: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Gift'
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
            ref: 'User'
        },
        type: {
            type: String,
            enum: ['anonymous', 'private', 'public'],
            default: 'public'
        },
        pos: {
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            }
        },
        bounds: {
            w: {
                type: Number,
                default: 0
            },
            h: {
                type: Number,
                default: 0
            }
        }
    }, {
        collection: 'users_gifts',
        autoIndex: false
    });
    
    /**
     * pre save
     * @param  {Function} next
     * @return void
     */
    schema.pre('validate', function(next) {
        if (this.isNew) {
            this.created_at = new Date();
        }
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
    schema.post('save', function(userGift) {
        if (this.wasNew) {
            UserModel.update({
                _id: userGift.from
            }, {
                $inc: {
                    'stats.gifts_sent': 1,
                    points: -20
                }
            }, function (err, user) {
            
            });
            UserModel.update({
                _id: userGift.to
            }, {
                $inc: {
                    'stats.gifts_received': 1,
                    'notifications.gifts': 1
                }
            }, function (err, user) {
            
            });
        }
    });

    /**
     * post remove middleware
     * @return {void}
     */
    schema.post('remove', function(userGift) {
        QuestionModel.update({
            _id: userGift.to
        }, {
            $inc: {'stats.gifts': -1}
        }, function (err, user) {
        
        });
    });

    return mongoose.model('UserGift', schema);
};

module.exports = new UserGift();
