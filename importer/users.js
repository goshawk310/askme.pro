var pool = require('./common').db.mysql.pool,
    convertToUtf8 = require('./common').convertToUtf8,
    downloadFile = require('./common').downloadFile,
    validator = require('validator'),
    _ = require('underscore'),
    fs = require('fs'),
    async = require('async'),
    UserModel = require('../models/user'),
    UserFollowedModel = require('../models/user/followed'),
    UserBlockedModel = require('../models/user/blocked'),
    FileImage = require('../lib/file/image'),
    settings = {
        users: {
            page: 0,
            limit: 1000
        },
        followed: {
            page: 0,
            limit: 1000
        },
        blocked: {
            page: 0,
            limit: 1000
        },
        avatars: {
            page: 0,
            limit: 20
        }
    };
require('../lib/database').config({
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
        var index = 0,
            errors = 0,
            limit = settings.avatars.limit,
            offset = page * limit;  
        UserModel.find({})
        .skip(offset)
        .limit(limit)
        .exec(function (err, users) {
            if (!err && users && users.length) {
                async.eachLimit(users, settings.avatars.limit / 2, function (user, callback) {
                    if (user.avatar && user.avatar !== 'photo_default.png') {
                        downloadFile('http://askme.pro/media/images/users/b_' + user.avatar,
                        __dirname + '/../uploads/avatars/' + user.avatar,
                        function (err, url, des) {
                            if (!err) {
                                var fileImage = new FileImage(des);
                                fileImage.cropCenter(function (err) {
                                    index += 1;
                                    if (!err) {
                                        this.quality(45, function (err) {
                                            if (err) {
                                                console.log(err);
                                                fs.unlink(des);
                                                errors += 1;
                                            }
                                            if (index === limit) {
                                                console.log('page: ' + settings.avatars.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                                                settings.avatars.page += 1;
                                                dataImport.avatars(settings.avatars.page);
                                            }
                                            callback();
                                        });
                                    } else {
                                        fs.unlink(des);
                                        index += 1;
                                        errors += 1;
                                        if (index === limit) {
                                            console.log('page: ' + settings.avatars.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                                            settings.avatars.page += 1;
                                            dataImport.avatars(settings.avatars.page);
                                        }
                                        callback();
                                    }
                                });
                            } else {
                                index += 1;
                                errors += 1;
                                if (index === limit) {
                                    console.log('page: ' + settings.avatars.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                                    settings.avatars.page += 1;
                                    dataImport.avatars(settings.avatars.page);
                                }
                                callback();
                            }
                        });
                    } else {
                        index += 1;
                        if (index === limit) {
                            console.log('page: ' + settings.avatars.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                            settings.avatars.page += 1;
                            dataImport.avatars(settings.avatars.page);
                        }
                        callback();
                    }
                }, function (err) {
                    console.log(err);
                });
            } else {
                return console.log('END OF IMPORT...')
            }
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
            default:
                console.log('invalid mode!');
                break;    
        }
    });
});