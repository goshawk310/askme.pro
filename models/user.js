'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    fsExtra = require('fs-extra'),
    config = require('../config/app'),
    path = require('path');

var User = function() {

    var schema = mongoose.Schema({
        username: {
            type: String,
            index: {
                unique: true
            },
            required: true,
            validate: [validate('len', 4, 20), validate('isAlphanumeric')]
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
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
        },
        settings: {
            anonymous_disallowed: {
                type: Boolean, default: false
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
            questions: {
                type: Number,
                default: 0
            },
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
            }
        },
        role: {
            type: String,
            enum: ['user', 'editor', 'admin'],
            default: 'user'
        }
    }, {
        collection: 'users',
        autoIndex: false
    });
    
    schema.virtual('pointsInt').get(function () {
        return Math.floor(this.points);
    });

    /** pre
     */
    schema.pre('save', function(next) {
        var user = this;
        user.terms_accepted = Boolean(user.terms_accepted);
        if (user.old === false && user.isModified('password')) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    next();
                })
            });
        } else if (user.isModified('status.value') && user.status.value === 0) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.status.changed_on + user.id, salt, function(err, token) {
                    if (err) {
                        return next(err);
                    }
                    user.status.token = token;
                    next();
                })
            });
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

    return mongoose.model('User', schema);
};

module.exports = new User();
