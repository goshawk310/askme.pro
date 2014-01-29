'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    UserModel = require('../user');

var UserBlocked = function() {

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
        collection: 'users_blocked',
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
    schema.post('save', function(blocked) {
        if (this.wasNew) {
            UserModel.update({
                _id: blocked.by
            }, {
                $push: {
                    'users.blocked': blocked.user
                }
            }, function (err, user) {
            
            });
        }
    });

    /**
     * post remove middleware
     * @return {void}
     */
    schema.post('remove', function(blocked) {
        UserModel.update({
            _id: blocked.by
        }, {
            $pull: {
                'users.blocked': blocked.user
            }
        }, function (err, user) {
        
        });
    });
    return mongoose.model('UserBlocked', schema);
};

module.exports = new UserBlocked();
