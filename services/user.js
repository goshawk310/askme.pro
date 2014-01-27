'use strict';
var UserModel = require('../models/user'),
    UserGiftModel = require('../models/user/gift'),
    userSchema = require('mongoose').model('User').schema,
    Email = require('../lib/email'),
    FileUpload = require('../lib/file/upload'),
    _ = require('underscore');

module.exports = _.extend({
    signup: function signup(req, res, callback) {
        UserModel.schema.path('password').validate(function(password) {
            return password == req.body.password2;
        }, 'Passwords do not match.');
        var user = new UserModel(req.body);
        user.save(function(err, user) {
            callback(req, res, user, err);
        });
    },
    resetPassword: function resetPassword(req, res, callback) {
        UserModel.findOne({
            email: req.body.email
        }, function(err, user) {
            if (err) {
                return callback(req, res, err);
            }
            if (user === null) {
                return callback(req, res, new Error('User not found'));
            }
            return user.resetPassword(function(err, user, newPassword) {
                if (err) {
                    return callback(req, res, err);
                }
                var email = new Email();
                email.setSubject('Odzyskiwanie hasla dla konta askme.pro!')
                    .setTo(user.email)
                    .setHtml('Witaj<br/>Nowe haslo to: ' + newPassword)
                    .send(function(err, message) {
                        if (err) {
                            return callback(req, res, err);
                        }
                        return callback(req, res);
                    });
            });
        });
    },
    changeAvatar: function changeAvatar() {
        var server = this.getServer(),
            req = this.getReq(),
            res = this.getRes(),
            upload = null,
            update = function update(err, req, res, filename) {
                if (err) {
                    return res.send({
                        status: 'error',
                        message: res.__('Wystąpił błąd podczas zmiany zdjęcia.')
                    });
                }
                UserModel.findById(req.user._id, function(err, user) {
                    if (err) {
                        return res.send({
                            status: 'error',
                            message: res.__('Wystąpił błąd podczas zmiany zdjęcia.')
                        });
                    }
                    user.avatar = require('path').basename(filename);
                    user.save(function (err) {
                        if (err) {
                            upload.clearAll();
                            return res.send({
                                status: 'error',
                                message: res.__('Wystąpił błąd podczas zmiany zdjęcia.')
                            });
                        }
                        return res.send({
                            status: 'success',
                            message: res.__('Zdjęcie zostało zmienione.'),
                            filename: user.avatar,
                            extra_message: !user.avatar ? res.__('Brak') : ''
                        });
                    });
                });
            };
        
        if (req.files && req.files.avatar) {
            upload = new FileUpload(req, res, {
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
                dir: server.locals.config.avatar.dir,
                fileKey: 'avatar',
                preProcess: function preProcess(file, callback) {
                    var thisObj = this,
                        FileImage = require('../lib/file/image'),
                        fileImage = new FileImage(file.path);
                    fileImage.checkSize(function (err, value) {
                        if (err || value.width < 300 || value.height < 300 || value.width > 5000 || value.height > 5000) {
                            thisObj.clearAll();
                            return callback(new Error('Invalid image size.'), thisObj.req, thisObj.res);
                        } else {
                            thisObj.renameFile(file, callback);
                        }
                    })
                },
                postProcess: function postProcess(filename, callback) {
                    var thisObj = this,
                        FileImage = require('../lib/file/image'),
                        fileImage = new FileImage(filename);
                    fileImage.cropCenter(function (err) {
                        if (err) {
                            thisObj.clearAll();
                            return callback(new Error('cropCenter error.'), thisObj.req, thisObj.res);
                        }
                        this.quality(45, function (err) {
                            if (err) {
                                thisObj.clearAll();
                                return callback(new Error('Quality change error.'), thisObj.req, thisObj.res);
                            } else {
                                return callback(null, thisObj.req, thisObj.res, filename);
                            }
                        });
                    });   
                }
            });
            upload.one(update);
        } else {
            update(null, req, res, null);
        }
    },
    update: function update(id, data, callback) {
        var req = this.getReq(),
            res = this.getRes();
        console.log(data);    
        UserModel.findById(id, function (err, user) {
            if (err) {
                return callback(err, req, res);    
            }
            user.set(data)
            user.save(function (err) {
                if (err) {
                    return callback(err, req, res);    
                }
                callback(null, req, res);
            });
        });
    },
    updatePrimaryData: function updatePrimaryData(id, data, callback) {
        this.update(id, _.pick(data, 'email', 'name', 'lastname', 'settings'), callback);
    },
    changePassword: function changePassword(id, data, callback) {
        var req = this.getReq(),
            res = this.getRes(),
            oldPassword = data.old_password,
            newPassword = data.password;
        UserModel.findById(id, function (err, user) {
            if (err) {
                return callback(err, req, res);    
            }
            user.comparePasswords(oldPassword, function(err, matched) {
                if (!matched) {
                    return callback(new Error('Passwords dont match'), req, res);
                }
                user.set({
                    password: newPassword
                });
                user.save(function (err) {
                    if (err) {
                        return callback(err, req, res);    
                    }
                    callback(null, req, res);
                });
            });
        });
    },
    updateProfileData: function updateProfileData(id, data, callback) {
        this.update(id, _.pick(data, 'profile', 'sticker', 'blocked_words'), callback);
    },
    updateBackground: function updateBackground(id, data, callback) {
        var config = this.getServer().locals.config;
        if (data.type === 'custom') {
            data.background = config.custom_background.url + data.background;
        } else {
            data.background = config.predefined_background.url + data.background;
        }
        this.update(id, _.pick(data, 'background'), callback);
    },
    changeCustomBackground: function changeCustomBackground() {
        var server = this.getServer(),
            req = this.getReq(),
            res = this.getRes(),
            upload = new FileUpload(req, res, {
            allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
            dir: server.locals.config.custom_background.dir,
            fileKey: 'custom_background',
            preProcess: function preProcess(file, callback) {
                var thisObj = this,
                    FileImage = require('../lib/file/image'),
                    fileImage = new FileImage(file.path);
                fileImage.checkSize(function (err, value) {
                    if (err || value.width < 2 || value.height < 2 || value.width > 2000 || value.height > 2000) {
                        thisObj.clearAll();
                        return callback(new Error('Invalid image size.'), thisObj.req, thisObj.res);
                    } else {
                        thisObj.renameFile(file, callback);
                    }
                })
            },
            postProcess: function postProcess(filename, callback) {
                var thisObj = this,
                    FileImage = require('../lib/file/image'),
                    fileImage = new FileImage(filename);
                fileImage.quality(45, function (err) {
                    if (err) {
                        thisObj.clearAll();
                        return callback(new Error('Quality change error.'), thisObj.req, thisObj.res);
                    } else {
                        return callback(null, thisObj.req, thisObj.res, filename);
                    }
                })
            }
        });
        upload.one(function (err, req, res, filename) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: res.__('Wystąpił błąd podczas zmiany zdjęcia.')
                });
            }
            UserModel.findById(req.user._id, function(err, user) {
                if (err) {
                    return res.send({
                        status: 'error',
                        message: res.__('Wystąpił błąd podczas zmiany zdjęcia.')
                    });
                }
                user.custom_background = require('path').basename(filename);
                user.save(function (err) {
                    if (err) {
                        upload.clearAll();
                        return res.send({
                            status: 'error',
                            message: res.__('Wystąpił błąd podczas zmiany zdjęcia.')
                        });
                    }
                    return res.send({
                        status: 'success',
                        message: res.__('Zdjęcie zostało zmienione.'),
                        filename: user.custom_background
                    });
                });
            });
        });
    },
    /**
     * [deactivate user]
     * @param  {Number}   id
     * @param  {Function} callback
     * @return {void}
     */
    deactivate: function deactivate(id, callback) {
        this.update(id, {status: {value: 0, modified_on: new Date()}}, callback);
    },

    /**
     * 
     * @param  {String}   username
     * @param  {Function} callback
     * @return {void}
     */
    getByUsername: function getByUsername(username, callback) {
        var req = this.getReq(),
            res = this.getRes(),
            next = this.getNext();
        UserModel.findOne({username: username}, function (err, user) {
            callback(err, user, next);
        });
    },

    changeTopbg: function changeTopbg() {
        var server = this.getServer(),
            req = this.getReq(),
            res = this.getRes(),
            upload = null,
            update = function update(err, req, res, filename) {
                if (err) {
                    return res.send({
                        status: 'error',
                        message: res.__('Wystąpił błąd podczas zmiany zdjęcia.')
                    });
                }
                UserModel.findById(req.user._id, function(err, user) {
                    if (err) {
                        return res.send({
                            status: 'error',
                            message: res.__('Wystąpił błąd podczas zmiany zdjęcia.')
                        });
                    }
                    user.top_bg = filename ? require('path').basename(filename) : null;
                    user.save(function (err) {
                        if (err) {
                            upload.clearAll();
                            return res.send({
                                status: 'error',
                                message: res.__('Wystąpił błąd podczas zmiany zdjęcia.')
                            });
                        }
                        return res.send({
                            status: 'success',
                            message: res.__('Zdjęcie zostało zmienione.'),
                            filename: user.top_bg,
                            extra_message: !user.top_bg ? res.__('Brak') : ''
                        });
                    });
                });
            };
        if (req.files && req.files.top_bg) {
            upload = new FileUpload(req, res, {
                allowedTypes: ['image/jpeg', 'image/jpg'],
                dir: server.locals.config.topbg.dir,
                fileKey: 'top_bg',
                preProcess: function preProcess(file, callback) {
                    var thisObj = this,
                        FileImage = require('../lib/file/image'),
                        fileImage = new FileImage(file.path);
                    fileImage.checkSize(function (err, value) {
                        if (err || value.width < 950 || value.height < 270 || value.width > 2000 || value.height > 2000) {
                            thisObj.clearAll();
                            return callback(new Error('Invalid image size.'), thisObj.req, thisObj.res);
                        } else {
                            thisObj.renameFile(file, callback);
                        }
                    })
                },
                postProcess: function postProcess(filename, callback) {
                    var thisObj = this,
                        FileImage = require('../lib/file/image'),
                        fileImage = new FileImage(filename);
                    fileImage.resize(970, null, function (err) {
                        if (err) {
                            thisObj.clearAll();
                            return callback(new Error('cropCenter error.'), thisObj.req, thisObj.res);
                        }
                        this.quality(45, function (err) {
                            if (err) {
                                thisObj.clearAll();
                                return callback(new Error('Quality change error.'), thisObj.req, thisObj.res);
                            } else {
                                return callback(null, thisObj.req, thisObj.res, filename);
                            }
                        });
                    }); 
                }
            });
            upload.one(update);
        } else {
            update(null, req, res, null);
        }
    },
    getUserGiftsById: function getUserGiftsById(id, callback) {
        UserGiftModel.find({
            to: id
        }).populate('gift', 'file').exec(callback);
    },
    getUserProfileGifts: function getUserProfileGifts(id, callback) {
        var weekAgo = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7); 
        UserGiftModel.find({
            to: id,
            created_at: {$gte: weekAgo}
        }).populate('gift', 'file').exec(callback);
    }
}, require('../lib/service'));
