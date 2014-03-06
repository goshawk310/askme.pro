var pool = require('./common').db.mysql.pool,
    convertToUtf8 = require('./common').convertToUtf8,
    validator = require('validator'),
    _ = require('underscore'),
    UserModel = require('../models/user'),
    minId = null,
    settings = {
        page: 0,
        limit: 1000
    };
require('./common').db.mongo();
var dataImport = {
    users: function users(connection, page) {
        var index = 0,
            errors = 0,
            limit = settings.limit,
            offset = page * limit, 
            sql = 'SELECT users.*, ' + convertToUtf8([
                'username', 'real_surname', 'real_name', 'website',
                'facebook', 'bio', 'what_ask', 'localization', 'words'
            ]) +
            ', stickerstype.image AS sticker_image FROM users LEFT JOIN stickerstype ON users.sticker = stickerstype.id' +
            ' WHERE users.password != "" AND visit >= "2013-09-01 00:00:00"' +
            (minId ? (' AND users.id > ' + minId) : '') +
            ' LIMIT ' + offset + ', ' + limit;
        connection.query(sql, function(err, rows) {
            if (err) {
                connection.release();
                return console.error(err);
            }
            if (!rows || !rows.length) {
                return console.log('END OF IMPORT...');
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
                    'sync.id': row.id
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
                        console.log('page: ' + settings.page + ', successful: ' + (limit - errors) + ', errors: ' + errors);
                        settings.page += 1;
                        dataImport.users(connection, settings.page);
                    }
                });
            });
            connection.release();
        });
    }
};
pool.getConnection(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    connection.query('SET NAMES utf8', function () {
        UserModel.find({})
        .sort({'sync.id': -1})
        .limit(1)
        .exec(function (err, users) {
            if (err) {
                return console.log(err);
            }
            if (users && users.length && users[0].sync && users[0].sync.id) {
                minId = users[0].sync.id;
            }
            dataImport.users(connection, settings.page);
        });
    });
});