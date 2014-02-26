var pool = require('../common').db.mysql.pool,
     _ = require('underscore'),
    async = require('async'),
    UserModel = require('../../models/user'),
    settings = {
        page: 0,
        limit: 20,
        processed: 0,
        errors: 0,
        overall: 0
    };
require('../../lib/database').config({
    host: 'localhost',
    name: 'askme_pro'
});

var dataImport = {
    users: function users(connection, page) {
        var index = 0,
            errors = 0,
            limit = settings.users.limit,
            offset = page * limit, 
            sql = 'SELECT users.*, ' + convertToUtf8([
                'username', 'real_surname', 'real_name', 'website',
                'facebook', 'bio', 'what_ask', 'localization', 'words'
            ]) +
            ', stickerstype.image AS sticker_image FROM users LEFT JOIN stickerstype ON users.sticker = stickerstype.id' +
            ' WHERE users.password != "" AND visit >= "2013-09-01 00:00:00"' +
            ' LIMIT ' + offset + ', ' + limit;

        connection.query(sql, function(err, rows) {
            if (err) {
                connection.release();
                return console.error(err);
            }
            if (!rows || !rows.length) {
                return console.log('END OF IMPORT...')
            }
            _.each(rows, function (row) {
                var data = {
                    created_at: new Date(row.reg_date.split('-').reverse().join('-')),
                    old: true,
                    username: row.username,
                    password: row.password,
                    email: row.email,
                    name: row.real_name,
                    lastname: row.real_surname,
                    avatar: row.photo,
                    settings: {
                        anonymous_disallowed: Boolean(row.anonymous_view)
                    },
                    profile: {
                        website: row.website && validator.validators.isUrl(row.website) ? row.website : null,
                        fanpage: row.facebook && validator.validators.isUrl(row.facebook) ? row.facebook : null,
                        location: row.localization ? row.localization : null,
                        motto: row.what_ask ? row.what_ask : null,
                        bio: row.bio ? row.bio : null
                    },
                    blocked_words: row.words,
                    sticker: row.sticker_image,
                    background: row.background ? '/uploads/backgrounds/' + row.background : '/images/themes/' + row.theme + '.png',
                    points: row.points,
                    terms_accepted: true,
                    status: row.status,
                    last_visit_at: new Date(row.visit),
                    blocked_words: row.words
                };
                if (row.background) {
                    data.custom_background = row.background;
                }
                if (parseInt(row.rank, 10) === 2) {
                    data.role = 'admin';
                } else if (parseInt(row.rank, 10) === 1) {
                    data.role = 'editor';
                } else {
                    data.role = 'user';
                }
                var user = new UserModel(data);
                user.save(function (err, user) {
                    index += 1;
                    if (err) {
                        errors += 1;
                    }
                    if (index === limit) {
                        console.log('page: ' + settings.users.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                        settings.users.page += 1;
                        dataImport.users(connection, settings.users.page);
                    }
                });
            });
            connection.release();
        });
    },
    followed: function followed(connection, page) {
        var index = 0,
            errors = 0,
            limit = settings.followed.limit,
            offset = page * limit;  
        UserModel.find({})
        .skip(offset)
        .limit(limit)
        .exec(function (err, users) {
            if (!err && users && users.length) {
                _.each(users, function (user) {
                    connection.query('SELECT * FROM users_friends WHERE username = "' + user.username + '"', function(err, rows) {
                        if (err || !rows || !rows.length) {
                            if (err) {
                                errors += 1;
                            }
                            index += 1;
                            if (index === limit) {
                                console.log('1.page: ' + settings.followed.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                                settings.followed.page += 1;
                                dataImport.followed(connection, settings.followed.page);
                            }
                        } else {
                            _.each(rows, function (row) {
                                UserModel
                                .findOne({username: row.friend})
                                .exec(function (err, followed) {
                                    if (err || !followed) {
                                        if (err) {
                                            errors += 1;
                                        }
                                        index += 1;
                                        if (index === limit) {
                                            console.log('2.page: ' + settings.followed.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                                            settings.followed.page += 1;
                                            dataImport.followed(connection, settings.followed.page);
                                        }
                                    } else {
                                        var userFollowed = new UserFollowedModel({
                                            by: user._id,
                                            user: followed._id
                                        });
                                        userFollowed.save(function (err) {
                                            index += 1;
                                            if (err) {
                                                errors += 1;
                                            }
                                            if (index === limit) {
                                                console.log('3.page: ' + settings.followed.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                                                settings.followed.page += 1;
                                                dataImport.followed(connection, settings.followed.page);
                                            }
                                        });
                                    }
                                });
                                
                            });
                        }
                    });
                });
                connection.release();
            } else {
                return console.log('END OF IMPORT...')
            }
        });
    },
    blocked: function blocked(connection, page) {
        var index = 0,
            errors = 0,
            limit = settings.blocked.limit,
            offset = page * limit;  
        UserModel.find({})
        .skip(offset)
        .limit(limit)
        .exec(function (err, users) {
            if (!err && users && users.length) {
                _.each(users, function (user) {
                    connection.query('SELECT * FROM users_blocked WHERE username = "' + user.username + '"', function(err, rows) {
                        if (err || !rows || !rows.length) {
                            if (err) {
                                errors += 1;
                            }
                            index += 1;
                            if (index === limit) {
                                console.log('1.page: ' + settings.blocked.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                                settings.blocked.page += 1;
                                dataImport.blocked(connection, settings.blocked.page);
                            }
                        } else {
                            _.each(rows, function (row) {
                                UserModel
                                .findOne({username: row.friend})
                                .exec(function (err, blocked) {
                                    if (err || !blocked) {
                                        if (err) {
                                            errors += 1;
                                        }
                                        index += 1;
                                        if (index === limit) {
                                            console.log('2.page: ' + settings.blocked.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                                            settings.blocked.page += 1;
                                            dataImport.blocked(connection, settings.blocked.page);
                                        }
                                    } else {
                                        var userBlocked = new UserBlockedModel({
                                            by: user._id,
                                            user: blocked._id
                                        });
                                        userBlocked.save(function (err) {
                                            index += 1;
                                            if (err) {
                                                errors += 1;
                                            }
                                            if (index === limit) {
                                                console.log('3.page: ' + settings.blocked.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                                                settings.blocked.page += 1;
                                                dataImport.blocked(connection, settings.blocked.page);
                                            }
                                        });
                                    }
                                });
                                
                            });
                        }
                    });
                });
                connection.release();
            } else {
                return console.log('END OF IMPORT...')
            }
        });
    },
    avatars: function avatars(page) {
        var limit = settings.avatars.limit,
            offset = page * limit;
        async.waterfall([
            function getUsers(callback) {
                UserModel.find({'sync.avatar': {$ne: true}})
                .skip(offset)
                .limit(limit)
                .exec(callback);
            }, function checkUsers(users, callback) {
                if (!users || !users.length) {
                    callback(new Error('endOfImport'));
                } else {
                    callback(null, users);
                }
            }, function processAvatar(users, callback) {
                var filesProcessed = 0,
                    errors = 0,
                    index = 0;
                async.eachLimit(users, settings.avatars.limit / 2, function (user, eachCallback) {
                    if (!user.avatar || user.avatar === 'photo_default.png') {
                        return eachCallback();
                    }
                    downloadFile('http://askme.pro/media/images/users/b_' + user.avatar,
                    __dirname + '/../uploads/avatars/' + user.avatar,
                    function (err, url, des) {
                        if (err) {
                            errors += 1;
                            return eachCallback();
                        }
                        var fileImage = new FileImage(des);
                        fileImage.quality(45, function (err) {
                            index += 1;
                            if (err) {
                                errors += 1;
                                fs.unlink(des);
                                return eachCallback();
                            }
                            this.cropCenter(function (err) {
                                index += 1;
                                if (err) {
                                    errors += 1;
                                    fs.unlink(des);
                                    return eachCallback();
                                }
                                filesProcessed += 1;
                                this.gmInstance = null;
                                delete this.gmInstance;
                                eachCallback();
                            });
                        });
                    });
                }, function (err) {
                    callback(null, users, filesProcessed, errors, index);
                });
            }
        ], 
        function (err, users, processed, errors, index) {
            if (err) {
                if (err.message && err.message === 'endOfImport') {
                    console.log(settings.avatars);
                    return console.log('END OF IMPORT');
                }
                console.log(err);
                console.log('restarting');
                settings.avatars = {
                    page: 0,
                    limit: 20,
                    processed: 0,
                    errors: 0,
                    overall: 0
                };
                dataImport.avatars(settings.avatars.page);
                return;
            }
            settings.avatars.errors += errors;
            settings.avatars.processed += processed;
            settings.avatars.overall += users.length;
            var ids = [];
            _.each(users, function (user) {
                ids.push(user._id);
            });
            UserModel.update({
                _id: {$in: ids}
            }, {
                'sync.avatar': true
            }, {
                multi: true
            }, function (err, numberAffected) {
                if (err) {
                    return console.log(err);
                }
                console.log('page: ' + settings.avatars.page + ', successful: ' + (users.length - errors) + ', processed: ' + processed + ', errors: ' + errors);
                settings.avatars.page += 1;
                dataImport.avatars(settings.avatars.page);
            });
        });      
    },
    backgrounds: function backgrounds(page) {
        var limit = settings.backgrounds.limit,
            offset = page * limit;
        async.waterfall([
            function getUsers(callback) {
                UserModel.find({'sync.bg': {$ne: true}})
                .skip(offset)
                .limit(limit)
                .exec(callback);
            }, function checkUsers(users, callback) {
                if (!users || !users.length) {
                    callback(new Error('endOfImport'));
                } else {
                    callback(null, users);
                }
            }, function processAvatar(users, callback) {
                var filesProcessed = 0,
                    errors = 0,
                    index = 0;
                async.eachLimit(users, settings.backgrounds.limit / 2, function (user, eachCallback) {
                    if (!user.custom_background) {
                        return eachCallback();
                    }
                    downloadFile('http://askme.pro/media/images/backgrounds/' + user.custom_background,
                    __dirname + '/../uploads/backgrounds/' + user.custom_background,
                    function (err, url, des) {
                        if (err) {
                            errors += 1;
                            return eachCallback();
                        }
                        var fileImage = new FileImage(des);
                        fileImage.quality(45, function (err) {
                            index += 1;
                            if (err) {
                                errors += 1;
                                fs.unlink(des);
                                return eachCallback();
                            }
                            filesProcessed += 1;
                            this.gmInstance = null;
                            delete this.gmInstance;
                            eachCallback();
                        });
                    });
                }, function (err) {
                    callback(null, users, filesProcessed, errors, index);
                });
            }
        ], 
        function (err, users, processed, errors, index) {
            if (err) {
                if (err.message && err.message === 'endOfImport') {
                    console.log(settings.backgrounds);
                    return console.log('END OF IMPORT');
                }
                console.log(err);
                console.log('restarting');
                settings.backgrounds = {
                    page: 0,
                    limit: 20,
                    processed: 0,
                    errors: 0,
                    overall: 0
                };
                dataImport.backgrounds(settings.backgrounds.page);
                return;
            }
            settings.backgrounds.errors += errors;
            settings.backgrounds.processed += processed;
            settings.backgrounds.overall += users.length;
            var ids = [];
            _.each(users, function (user) {
                ids.push(user._id);
            });
            UserModel.update({
                _id: {$in: ids}
            }, {
                'sync.bg': true
            }, {
                multi: true
            }, function (err, numberAffected) {
                if (err) {
                    return console.log(err);
                }
                console.log('page: ' + settings.backgrounds.page + ', successful: ' + (users.length - errors) + ', processed: ' + processed + ', errors: ' + errors);
                settings.backgrounds.page += 1;
                dataImport.backgrounds(settings.backgrounds.page);
            });
        });      
    }
};
pool.getConnection(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    connection.query('SET NAMES utf8', function () {
        var mode = process.argv[2] ? process.argv[2] : 'users';
        switch(mode) {
            case 'users':
                dataImport.users(connection, settings.users.page);
                break;
            case 'followed':
                dataImport.followed(connection, settings.followed.page);
                break;
            case 'blocked':
                dataImport.blocked(connection, settings.blocked.page);
                break;
            case 'avatars':
                dataImport.avatars(settings.avatars.page);
                break;
            case 'backgrounds':
                dataImport.backgrounds(settings.backgrounds.page);
                break;     
            default:
                console.log('invalid mode!');
                break;    
        }
    });
});