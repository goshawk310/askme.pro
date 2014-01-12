'use strict';
var UserModel = require('../models/user'),
    userSchema = require('mongoose').model('User').schema,
    Email = require('../lib/email'),
    FileUpload = require('../lib/file/upload'),
    _ = require('underscore');

module.exports = {
    req: null,
    res: null,
    server: null,
    setReq: function setReq(value) {
        this.req = value;
        return this;
    },
    setRes: function setRes(value) {
        this.res = value;
        return this;
    },
    setServer: function setServer(value) {
        this.server = value;
        return this;
    },
    getReq: function getReq() {
        return this.req;
    },
    getRes: function getRes() {
        return this.res;
    },
    getServer: function getServer() {
        return this.server;
    },
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
    changeAvatar: function changeAvatar(server, req, res) {
        var upload = new FileUpload(req, res, {
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
                        filename: user.avatar
                    });
                });
            });
        });
    },
    update: function update(id, data, callback) {
        var req = this.getReq(),
            res = this.getRes();
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
        this.update(id, {status: 0}, callback);
    }
};
