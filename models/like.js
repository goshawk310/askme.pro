'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    ioHelper = require('../lib/socket.io');

var Like = function() {

    var schema = mongoose.Schema({
        created_at: {
            type: Date,
            default: Date.now
        },
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
        var QuestionModel = require('./question'),
            UserModel = require('./user');
        if (this.wasNew) {
            QuestionModel.update({
                _id: like.question_id
            }, {
                $inc: {'stats.likes': 1}
            }, function (err, user) {
            
            });
            if (this.sync && this.sync.id) {
                UserModel.update({
                    _id: like.to
                }, {
                    $inc: {
                        'stats.likes': 1
                    }
                }, function (err, user) {
                
                });
                return;
            }
            UserModel.update({
                _id: like.to
            }, {
                $inc: {
                    'stats.likes': 1,
                    'notifications.likes': 1
                }
            }, function (err, user) {
            
            });
            /*var io = ioHelper.io();
            if (io) {
                io.sockets.socket(ioHelper.getSocketId(like.to)).emit('likes', {
                    id: like.question_id
                });
            }*/
        }
    });

    /**
     * post remove middleware
     * @return {void}
     */
    schema.post('remove', function(like) {
        var QuestionModel = require('./question'),
            UserModel = require('./user');
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

    return mongoose.model('Like', schema);
};

module.exports = new Like();
