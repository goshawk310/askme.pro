'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    bcrypt = require('bcrypt'),
    crypto = require('crypto');

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
        old: {
            type: Boolean,
            default: false
        },
        terms_accepted: {
            type: Boolean,
            default: false,
            validate: [validate('equals', true)]
        }
    }, {
        collection: 'user',
        autoIndex: false
    });

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
        } else {
            next();
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
            password = crypto.createHash('md5').update(password.toLowerCase()).digest("hex");
            password = (new Buffer(password)).toString('base64');
            password = crypto.createHash('sha1').update(password).digest("hex");
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
