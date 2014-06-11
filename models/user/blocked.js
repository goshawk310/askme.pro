'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate;

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
        var userBlocked = this;
        this.wasNew = this.isNew;
        if (this.isNew) {
            require('../user').findOne({
                _id: userBlocked.user
            }, function (err, doc) {
                if (err || !doc || doc.role !== 'user') {
                    return next(new Error('Invalid user'));
                }
                next();
            });
        } else {
            next();
        }
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
            var UserModel = require('../user');
            UserModel.update({
                _id: blocked.by
            }, {
                $addToSet: {
                    'users.blocked': blocked.user
                }
            }, function (err, user) {
            
            });
            UserModel.update({
                _id: blocked.user
            }, {
                $addToSet: {
                    'users.blocked': blocked.by
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
        var UserModel = require('../user');
        this.model('UserBlocked').findOne({
            by: blocked.user
        }, function (err, doc) {
            if (err || doc) {
                return;
            }
            UserModel.update({
                _id: blocked.by
            }, {
                $pull: {
                    'users.blocked': blocked.user
                }
            }, function (err, user) {
            
            });
            UserModel.update({
                _id: blocked.user
            }, {
                $pull: {
                    'users.blocked': blocked.by
                }
            }, function (err, user) {
            
            });
        });
    });
    return mongoose.model('UserBlocked', schema);
};

module.exports = new UserBlocked();
