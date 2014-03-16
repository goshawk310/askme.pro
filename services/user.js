'use strict';
var UserModel = require('../models/user'),
    UserGiftModel = require('../models/user/gift'),
    UserFollowedModel = require('../models/user/followed'),
    UserBlockedModel = require('../models/user/blocked'),
    QuestionModel = require('../models/question'),
    userSchema = require('mongoose').model('User').schema,
    Email = require('../lib/email'),
    FileUpload = require('../lib/file/upload'),
    _ = require('underscore');

module.exports = _.defaults({
    signup: function signup(req, res, callback) {
        var user = new UserModel(_.pick(req.body, 'username', 'email', 'password', 'name', 'lastname', 'terms_accepted'));
        user.save(function(err, user) {
            callback(req, res, user, err);
        });
    },
    completeRegistration: function completeRegistration(id, callback) {
        var req = this.getReq();
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return callback(err);
            }
            var data = _.pick(req.body, 'username', 'password', 'terms_accepted');
            data.incomplete = false;
            data.status = {
                value: 1
            };
            user.set(data);
            user.save(callback);
        });
    },
    logout: function logout(id) {
        UserModel.update({_id: id}, {last_visit_at: null}, function (err) {
            if (!err) {
                console.log('logged out');
            }
        });
    },
    resetPassword: function resetPassword(req, res, callback) {
        UserModel.findOne({
            email: new RegExp('^' + req.body.email + '$', 'i')
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
                if (upload) {
                    upload.gmInstance = null;
                    delete upload.gmInstance;
                }
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
                            if (upload) {
                                upload.clearAll();
                            }
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
                    });
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
                        this.quality(60, function (err) {
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
        UserModel.findById(id, function (err, user) {
            if (err) {
                return callback(err, req, res);    
            }
            user.set(data);
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
                    if (err || value.width < 2 || value.height < 2 || value.width > 5000 || value.height > 5000) {
                        thisObj.clearAll();
                        return callback(new Error('Invalid image size.'), thisObj.req, thisObj.res);
                    } else {
                        thisObj.renameFile(file, callback);
                    }
                });
            },
            postProcess: function postProcess(filename, callback) {
                var thisObj = this,
                    FileImage = require('../lib/file/image'),
                    fileImage = new FileImage(filename);
                fileImage.quality(60, function (err) {
                    if (err) {
                        thisObj.clearAll();
                        return callback(new Error('Quality change error.'), thisObj.req, thisObj.res);
                    } else {
                        return callback(null, thisObj.req, thisObj.res, filename);
                    }
                });
            }
        });
        upload.one(function (err, req, res, filename) {
            upload.gmInstance = null;
            delete upload.gmInstance;
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
        UserModel.findOne({username: new RegExp('^' + username + '$', 'i')}, callback);
    },

    changeTopbg: function changeTopbg() {
        var server = this.getServer(),
            req = this.getReq(),
            res = this.getRes(),
            upload = null,
            update = function update(err, req, res, filename) {
                if (upload) {
                    upload.gmInstance = null;
                    delete upload.gmInstance;
                }
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
                            if (upload) {
                                upload.clearAll();
                            }
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
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                dir: server.locals.config.topbg.dir,
                fileKey: 'top_bg',
                preProcess: function preProcess(file, callback) {
                    var thisObj = this,
                        FileImage = require('../lib/file/image'),
                        fileImage = new FileImage(file.path);
                    fileImage.checkSize(function (err, value) {
                        if (err || value.width < 200 || value.height < 200 || value.width > 5000 || value.height > 5000) {
                            thisObj.clearAll();
                            return callback(new Error('Invalid image size.' + value.width + 'x' + value.height), thisObj.req, thisObj.res);
                        } else {
                            thisObj.renameFile(file, callback);
                        }
                    });
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
                        this.quality(60, function (err) {
                            thisObj.gmInstance = null;
                            delete thisObj.gmInstance;
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
    getGiftsById: function getGiftsById(id, params, callback) {
        var req = this.getReq(),
            page = params.page || 0,
            limit = params.limit || 12,
            skip = limit * page,
            showPrivate = (req.user && req.user._id.toString() === id.toString()) ? true : false,
            where = {
                to: id
            };
        if (!showPrivate) {
            where.type = {$ne: 'private'};
        }
        UserGiftModel
            .count(where, function (err, total) {
                UserGiftModel
                .find(where)
                .select('created_at gift from type')
                .populate('gift', 'file')
                .populate('from', 'username')
                .skip(skip)
                .limit(limit)
                .sort({_id: -1})
                .exec(function (err, gifts) {
                    if (err) {
                        return callback(err);
                    }
                    var output = [],
                        giftObj = null;
                    gifts.forEach(function (gift) {
                        giftObj = gift.toObject();
                        if (giftObj.type === 'anonymous') {
                            giftObj.from = null;
                        }
                        output.push(giftObj);
                    });
                    return callback(null, {
                        total: total,
                        gifts: output
                    });
                });
            });   
    },
    getUserProfileGifts: function getUserProfileGifts(id, callback) {
        var weekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7); 
        UserGiftModel.find({
            to: id,
            created_at: {$gte: weekAgo}
        }).populate('gift', 'file').exec(callback);
    },
    follow: function follow(by, user, callback) {
        var userFollowed = new UserFollowedModel({
            by: by,
            user: user
        });
        userFollowed.save(callback);
    },
    unfollow: function unfollow(by, user, callback) {
        UserFollowedModel
            .findOne({
                by: by,
                user: user
            })
            .exec(function (err, followed) {
                if (err) {
                    return callback(err);
                }
                if (followed === null) {
                    return callback(new Error('Followed not found'));
                }
                followed.remove(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, followed);
                });
            });
    },
    block: function block(by, user, callback) {
        var userBlocked = new UserBlockedModel({
            by: by,
            user: user
        });
        userBlocked.save(callback);
    },
    unblock: function unblock(by, user, callback) {
        UserBlockedModel
            .findOne({
                by: by,
                user: user
            })
            .exec(function (err, blocked) {
                if (err) {
                    return callback(err);
                }
                if (blocked === null) {
                    return callback(new Error('Blocked not found'));
                }
                blocked.remove(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, blocked);
                });
            });
    },
    getFollowedById: function getFollowedById(id, params, callback) {
        var req = this.getReq(),
            page = params.page || 0,
            limit = params.limit || 18,
            skip = limit * page;
        UserFollowedModel
            .find({
                by: id
            })
            .populate('user', 'username avatar profile.location')
            .skip(skip)
            .limit(limit)
            .sort({_id: -1})
            .exec(function (err, users) {
                if (err) {
                    return callback(err);
                }
                return callback(null, {
                    total: params.total,
                    users: users
                });
            });  
    },
    getFollowingById: function getFollowingById(id, params, callback) {
        var req = this.getReq(),
            page = params.page || 0,
            limit = params.limit || 18,
            skip = limit * page;
        UserFollowedModel
            .find({
                user: id
            })
            .populate('by', 'username avatar profile.location')
            .skip(skip)
            .limit(limit)
            .sort({_id: -1})
            .exec(function (err, users) {
                if (err) {
                    return callback(err);
                }
                return callback(null, {
                    total: params.total,
                    users: users
                });
            });  
    },
    getPhotosById: function getPhotosById(id, params, callback) {
        var page = params.page || 0,
            limit = params.limit || 18,
            skip = limit * page,
            where = {
                to: id,
                image: {$ne: null}
            };
        QuestionModel.count(where, function (err, total) {
            if (err) {
                return callback(err);
            }
            if (!total) {
                return callback(null, {
                    total: 0,
                    photos: []
                });
            }
            QuestionModel
                .find(where)
                .select('to answered_at image')
                .skip(skip)
                .limit(limit)
                .sort({answered_at: -1})
                .exec(function (err, photos) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, {
                        total: total,
                        photos: photos
                    });
                });
        });  
    },
    getVideosById: function getVideosById(id, params, callback) {
        var page = params.page || 0,
            limit = params.limit || 6,
            skip = limit * page,
            where = {
                to: id,
                $or: [{yt_video: {$ne: null}}, {answer: /.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/}]
            };
        QuestionModel.count(where, function (err, total) {
            if (err) {
                return callback(err);
            }
            console.log(total);
            if (!total) {
                return callback(null, {
                    total: 0,
                    videos: []
                });
            }
            QuestionModel
                .find(where)
                .select('to answered_at yt_video answer')
                .skip(skip)
                .limit(limit)
                .sort({answered_at: -1})
                .exec(function (err, rows) {
                    if (err) {
                        return callback(err);
                    }
                    var urlRegexp = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi,
                        ytRegExp = /.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
                        videos = [];
                    _.each(rows, function (row) {
                        if (row.yt_video !== null) {
                            videos.push(_.pick(row, 'to', 'answered_at', 'yt_video'));
                        }
                        var urlMatches = row.answer.match(urlRegexp);
                        if (urlMatches) {
                            _.each(urlMatches, function (url) {
                                var matches = url.match(ytRegExp);
                                if (matches && matches[2].length) {
                                    var video = _.pick(row, 'to', 'answered_at');
                                    video.yt_video = matches[2];
                                    videos.push(video);      
                                }
                            });
                        } 
                    });
                        
                       
                    return callback(null, {
                        total: total,
                        videos: videos
                    });
                });
        });  
    },
    /**
     * 
     * @param  {Object}   params
     * @param  {Function} callback
     * @return {void}
     */
    getOnline: function getOnline(params, callback) {
        var whereAnd = [];
        params = params || {};
        whereAnd.push({'status.value': 1});
        whereAnd.push({last_visit_at: {$gt: Date.now() - 240000}});
        if (params.followed && _.isArray(params.followed)) {
            whereAnd.push({_id: {$in: params.followed}});
        }
        if (params.blocked && _.isArray(params.blocked)) {
            whereAnd.push({_id: {$nin: params.blocked}});
        }
        if (params.id) {
            whereAnd.push({_id: {$ne: params.id}});
        }
        UserModel
            .find({$and: whereAnd})
            .select('username avatar')
            .sort({last_visit_at: -1})
            .limit(params.limit ? parseInt(params.limit, 10) : null)
            .exec(callback);
    },
    resetNotifications: function resetNotifications(params, callback) {
        var set = {};
        if (_.isString(params.key)) {
            set['notifications.' + params.key] = 0;
        } else if (_.isArray(params.key)) {
            _.each(params.key, function (key) {
                set['notifications.' + key] = 0;
            });
        }
        UserModel
            .update({_id:params.id}, {$set: set}, callback);
    },
    search: function search(params, callback) {
        var page = params.page || 0,
            limit = params.limit || 18,
            skip = limit * page,
            regex = new RegExp(params.query, 'i'),
            whereOr = [{username: {$regex: regex}}, {name: {$regex: regex}}, {lastname: {$regex: regex}}];
        UserModel.count({$or: whereOr, 'status.value': 1}, function (err, total) {
            if (err) {
                return callback(err);
            }
            if (!total) {
                return callback(null, {
                    total: 0,
                    users: []
                });
            }
            UserModel
                .find({$or: whereOr})
                .select('username name lastname avatar profile.location')
                .skip(skip)
                .limit(limit)
                .sort({'stats.likes': -1})
                .exec(function (err, users) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, {
                        total: total,
                        users: users
                    });
                });
        });  
    },
    /**
     * 
     * @param  {Object}   params
     * @param  {Function} callback
     * @return {void}
     */
    getTop20: function getTop20(params, callback) {
        var req = this.getReq(),
            sort = {},
            mode = params.mode || 'points',
            followed = [],
            whereAnd = [{'status.value': 1}];
        switch(mode) {
            case 'likes':
                sort = {'stats.likes': -1};
                break;
            case 'followers':
                sort = {'stats.followers': -1};
                break;    
            default:
                sort = {points: -1};
                break;
        }
        if (req.isAuthenticated() && req.user.users) {
            whereAnd.push({
                _id: {$nin: req.user.users.blocked}
            });
            followed = req.user.users.followed;
        }
        UserModel
            .find(whereAnd)
            .select('username avatar stats.likes stats.followers points profile.motto')
            .limit(20)
            .sort(sort)
            .exec(function (err, users) {
                if (err) {
                    return callback(err);
                }
                if (followed.length) {
                    var output = [];
                    _.each(users, function (user) {
                        var obj = user.toObject();
                        obj.isFollowed = user.isFollowed(followed);
                        output.push(obj)
                    });
                    callback(null, output);
                } else {
                    callback(null, users);
                }
            });
    },
    fixStatsCounter: function fixStatsCounter(user, callback) {
        QuestionModel
        .count({'$and': [{to: user._id}, {answer: null}]})
        .exec(function (err, total) {
            if (err || total === user.stats.questions_unanswered) {
                return callback(user);
            }
            user.set('stats.questions_unanswered', total);
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                callback(user);
            });
        });
    }
}, require('../lib/service'));
