var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    fsExtra = require('fs-extra'),
    config = require('../config/app'),
    path = require('path'),
    _ = require('underscore');

var User = function() {
    var schema = mongoose.Schema({
        created_at: {
            type: Date,
            default: Date.now
        },
        username: {
            type: String,
            index: {
                unique: true
            },
            required: true,
            validate: [validate('len', 4, 100), validate('regex', /[A-Za-z0-9\.\_\-]+/)]
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            index: {
                unique: true
            },
            required: true,
            validate: [validate('isEmail')]
        },
        name: {
            type: String,
            required: false
        },
        lastname: {
            type: String,
            required: false
        },
        avatar: {
            type: String,
        },
        settings: {
            anonymous_disallowed: {
                type: Boolean,
                default: false
            }
        },
        profile: {
            website: {
                type: String,
                validate: [validate({passIfEmpty: true}, 'isUrl')],
                default: null
            },
            fanpage: {
                type: String,
                validate: [validate({passIfEmpty: true} ,'isUrl')],
                default: null
            },
            location: {
                type: String,
                default: null
            },
            motto: {
                type: String,
                default: null
            },
            bio: {
                type: String,
                default: null
            }
        },
        blocked_words: {
            type: String
        },
        sticker: {
            type: String
        },
        background: {
            type: String
        },
        custom_background: {
            type: String
        },
        top_bg: {
            type: String
        },
        points: {
            type: Number,
            default: 0
        },
        old: {
            type: Boolean,
            default: false
        },
        terms_accepted: {
            type: Boolean,
            default: false,
            validate: [validate('equals', true)]
        },
        status: {
            value: {
                type: Number,
                default: 1    
            },
            modified_on: {
                type: Date,
                default: null
            },
            token: {
                type: String,
                default: null
            }
        },
        stats: {
            questions_unanswered: {
                type: Number,
                default: 0
            },
            questions_answered: {
                type: Number,
                default: 0
            },
            likes: {
                type: Number,
                default: 0
            },
            gifts_sent: {
                type: Number,
                default: 0
            },
            gifts_received: {
                type: Number,
                default: 0
            },
            follows: {
                type: Number,
                default: 0
            },
            followers: {
                type: Number,
                default: 0
            }
        },
        notifications: {
            answers: {
                type: Number,
                default: 0
            },
            gifts: {
                type: Number,
                default: 0
            },
            likes: {
                type: Number,
                default: 0
            },
            comments: {
                type: Number,
                default: 0
            }
        },
        users: {
            followed: [{
                type: mongoose.Schema.Types.ObjectId,
                require: false,
                ref: 'User'
            }],
            blocked: [{
                type: mongoose.Schema.Types.ObjectId,
                require: false,
                ref: 'User'
            }] 
        },
        role: {
            type: String,
            enum: ['user', 'editor', 'moderator', 'admin'],
            default: 'user'
        },
        last_visit_at: {
            type: Date,
            default: null
        },
        facebook: {
            id: {
                type: String
            },
            r_no_username: {
                type: Boolean
            },
            r_no_email: {
                type: Boolean
            }
        },
        incomplete: {
            type: Boolean,
            default: false
        },
        sync: {
            avatar: {
                type: Boolean,
                default: false
            },
            bg: {
                type: Boolean,
                default: false
            },
            id: {
                type: Number,
                required: false,
                index: {unique: true, sparse: true}
            }
        }
    }, {
        collection: 'users',
        autoIndex: false
    });
    
    schema.virtual('pointsInt').get(function () {
        return Math.floor(this.points);
    });

    schema.virtual('online').get(function () {
        if (this.last_visit_at) {
            return Date.now() - this.last_visit_at.getTime() < 240000;
        }
        return false;
    });

    schema.virtual('notifications.feed').get(function () {
        return this.notifications.comments + this.notifications.answers;
    });

    /**
     * [isFollowed description]
     * @param  {Array}  followed
     * @return {Boolean}
     */
    schema.methods.isFollowed = function (followed) {
        var isFollowed = false;
        if (followed && followed.indexOf(this._id) !== -1) {
            isFollowed = true;
        }
        return isFollowed;
    };

    /**
     * [isBlocked description]
     * @param  {Array}  blocked
     * @return {Boolean}
     */
    schema.methods.isBlocked = function (blocked) {
        var isBlocked = false;
        if (blocked && blocked.indexOf(this._id) !== -1) {
            isBlocked = true;
        }
        return isBlocked;
    };

    /**
     * [isFollowing description]
     * @param  {String}  followed
     * @return {Boolean}
     */
    schema.methods.isFollowing = function isFollowing(id) {
        if (this.users && this.users.followed && this.users.followed.indexOf(id) !== -1) {
            return true;
        }
        return false;
    };

    /** 
     * pre
     */
    schema.pre('save', function(next) {
        var user = this;
        user.terms_accepted = Boolean(user.terms_accepted);
        if (user.old === false && user.isModified('password')) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) {
                    return next(err);
                }
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    next();
                });
            });
        } else if (user.isModified('status.value')) {
            user.status.modified_on = new Date();
            if (user.status.value === 0) {
                bcrypt.genSalt(10, function(err, salt) {
                    if (err) {
                        return next(err);
                    }
                    bcrypt.hash(user.status.modified_on + user.id, salt, function(err, token) {
                        if (err) {
                            return next(err);
                        }
                        user.status.token = token;
                        next();
                    });
                });
            } else {
                next();
            }
        } else {
            next();
        }
    });

    schema.post('init', function() {
        this._original = this.toObject();
    });

    schema.post('save', function () {
        var ext = '',
            oldAvatar = null,
            oldBackground = null,
            oldTopbg = null;
        if (this._original) {
            oldAvatar = this._original.avatar ? this._original.avatar : null,
            oldBackground = this._original.custom_background ? this._original.custom_background: null;
            oldTopbg = this._original.top_bg ? this._original.top_bg: null;
            if (oldAvatar && this.avatar !== oldAvatar) {
                ext = path.extname(oldAvatar);
                fsExtra.remove(config.avatar.dir + oldAvatar);
                fsExtra.remove(config.avatar.dir + oldAvatar.replace(ext, ''));
            }
            if (oldBackground && this.custom_background !== oldBackground) {
                fsExtra.remove(config.custom_background.dir + oldBackground);
            }
            if (oldTopbg && this.top_bg !== oldTopbg) {
                fsExtra.remove(config.topbg.dir + oldTopbg);
            }
        }
    });
    
    /**
     * post remove
     * @return void
     */
    schema.post('remove', function(user) {
        var UserBlockedModel = require('./user/blocked'),
            UserFollowedModel = require('./user/followed');
        if (user.avatar) {
            fsExtra.remove(config.avatar.dir + user.avatar);
            fsExtra.remove(config.avatar.dir + user.avatar.replace(path.extname(user.avatar), ''));
        }
        if (user.custom_background) {
            fsExtra.remove(config.custom_background.dir + user.custom_background);
        }
        if (user.top_bg) {
            fsExtra.remove(config.top_bg.dir + user.top_bg);
        }
        UserBlockedModel.remove({
            $or: [{by: user._id}, {user: user._id}]
        }, function () {
               
        });
        UserFollowedModel.remove({
            $or: [{by: user._id}, {user: user._id}]
        }, function () {
               
        });
        mongoose.model('User', schema).removeAll(user._id);
    });

    schema.methods.comparePasswords = function comparePasswords(password, callback) {
        if (this.old === false) {
            return bcrypt.compare(password, this.password, function(err, matched) {
                if (err) {
                    return callback(err);
                }
                return callback(null, matched);
            });
        } else {
            var matched = false;
            password = crypto.createHash('md5').update(password.toLowerCase()).digest('hex');
            password = (new Buffer(password)).toString('base64');
            password = crypto.createHash('sha1').update(password).digest('hex');
            if (password === this.password) {
                matched = true;
            }
            return callback(null, matched);
        }
        return callback(null, false);
    };

    schema.methods.resetPassword = function resetPassword(callback) {
        var newPassword = require('crypto').randomBytes(6).toString('hex');
        this.password = newPassword;
        this.old = false;
        this.save(function(err, user) {
            callback(err, user, newPassword);
        });
    };

    schema.statics.removeAll = function removeAll(id, callback) {
        var UserBlockedModel = require('./user/blocked'),
            UserFollowedModel = require('./user/followed'),
            UserGiftModel = require('./user/gift'),
            QuestionModel = require('./question'),
            CommentModel = require('./comment'),
            LikeModel = require('./like');
        UserGiftModel.removeAllTo(id, function () {

        });
        UserGiftModel.removeAllFrom(id, function () {
            
        });
        QuestionModel.removeAllTo(id, function () {

        });
        QuestionModel.removeAllFrom(id, function () {
            
        });
        CommentModel.removeAllTo(id, function () {

        });
        CommentModel.removeAllFrom(id, function () {
            
        });
        LikeModel.removeAllTo(id, function () {

        });
        LikeModel.removeAllFrom(id, function () {
            
        });
    };

    return mongoose.model('User', schema);
};

module.exports = new User();
