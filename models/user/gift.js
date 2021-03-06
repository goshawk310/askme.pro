'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate;

var UserGift = function() {

    var schema = mongoose.Schema({
        created_at: {
            type: Date,
            required: true,
            default: Date.now
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
        }, 
        sync: {
            id: {
                type: Number,
                required: false,
                index: {unique: true, sparse: true}
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
            var UserModel = require('../user'),
                inc = {
                    'stats.gifts_sent': 1
                };
            if (!userGift.sync || !userGift.sync.id) {
                inc.points = -20;
            }    
            UserModel.update({
                _id: userGift.from
            }, {
                $inc: inc
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
        var UserModel = require('../user');
        UserModel.update({
            _id: userGift.to
        }, {
            $inc: {'stats.gifts': -1}
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

    return mongoose.model('UserGift', schema);
};

module.exports = new UserGift();
