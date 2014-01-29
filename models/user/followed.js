'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    UserModel = require('../user');

var UserFollowed = function() {

    var schema = mongoose.Schema({
        created_at: {
            type: Date,
            default: Date.now,
            required: true
        },
        by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true
        }
    }, {
        collection: 'users_followed',
        autoIndex: false
    });
    
    schema.index({by: 1, user: 1}, {unique: true});

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
    schema.post('save', function(followed) {
        if (this.wasNew) {
            UserModel.update({
                _id: followed.by
            }, {
                $push: {
                    'users.followed': followed.user
                },
                $inc: {
                    'stats.follows': 1
                }
            }, function (err, user) {
            
            });
            UserModel.update({
                _id: followed.user
            }, {
                $inc: {
                    'stats.followers': 1
                }
            }, function (err, user) {
            
            });
        }
    });

    /**
     * post remove middleware
     * @return {void}
     */
    schema.post('remove', function(followed) {
        UserModel.update({
            _id: followed.by
        }, {
            $pull: {
                'users.followed': followed.user
            },
            $inc: {
                    'stats.follows': -1
                }
        }, function (err, user) {
        
        });
        UserModel.update({
                _id: followed.user
            }, {
                $inc: {
                    'stats.followers': -1
                }
            }, function (err, user) {
            
            });
    });
    return mongoose.model('UserFollowed', schema);
};

module.exports = new UserFollowed();
