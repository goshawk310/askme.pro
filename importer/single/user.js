var pool = require('../common').db.mysql.pool,
    convertToUtf8 = require('../common').convertToUtf8,
    validator = require('validator'),
    _ = require('underscore'),
    UserModel = require('../../models/user'),
    username = process.argv[2] || '';
require('../common').db.mongo();
var dataImport = {
    users: function users(connection) {
        var sql = 'SELECT users.id, users.password, users.rank, users.email, users.fanpage, users.points, ' +
                'users.sticker, users.theme, users.background, users.photo, users.status, users.ip, ' + 
                'users.anonymous_view, users.reg_date, users.lang, users.activated, users.visit, users.visit_timestamp, ' + 
                convertToUtf8([
                    'username', 'real_surname', 'real_name', 'website',
                    'facebook', 'bio', 'what_ask', 'localization', 'words'
                ]) +
                ', stickerstype.image AS sticker_image FROM users LEFT JOIN stickerstype ON users.sticker = stickerstype.id' +
                ' WHERE users.username = "' + username + '"';
                console.log(sql);
        connection.query(sql, function(err, rows) {
            if (err) {
                connection.release();
                return console.error(err);
            }
            if (!rows || !rows.length) {
                return console.log('END OF IMPORT...');
            }
            var row = rows[0],
                data = {
                created_at: new Date(row.reg_date.split('-').reverse().join('-')),
                old: true,
                username: row.username,
                password: row.password || (new Date).getTime(),
                email: row.email,
                name: row.real_name,
                lastname: row.real_surname,
                avatar: row.photo === 'default_photo.png' ? null : row.photo,
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
                points: parseInt(row.points, 10),
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
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('ok');
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
        return dataImport.users(connection);
    });
});