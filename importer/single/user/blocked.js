var pool = require('../../common').db.mysql.pool,
    convertToUtf8 = require('../../common').convertToUtf8,
     _ = require('underscore'),
    async = require('async'),
    UserModel = require('../../../models/user'),
    UserBlockedModel = require('../../../models/user/blocked'),
    username = process.argv[2] || '';
require('../../common').db.mongo();
var dataImport = {
    blocked: function users(connection) {
        var count = 0,
            errors = 0;
        async.waterfall([
            function get(callback) {
                var sql = 'SELECT *' +
                    ' FROM users_blocked' +
                    ' WHERE username = "' + username + '" OR blocked = "' + username + '"';
                connection.query(sql, function (err, rows) {
                    callback(err, rows);
                }); 
            },
            function check(rows, callback) {
                if (!rows || !rows.length) {
                    callback(new Error('endOfImport'));
                } else {
                    callback(null, rows);
                }
            },
            function each(rows, callback) {
                async.eachLimit(rows, 50, function (row, eachCallback) {
                    async.waterfall([
                        function getFollowingUser(nestedCallback) {
                            UserModel.findOne({username: row.username}, function (err, by) {
                                if (err) {
                                    return nestedCallback(err);
                                }
                                if (!by) {
                                    return nestedCallback(new Error('User not found: "' + row.username + '"'));
                                }
                                nestedCallback(null, row, by);
                            });
                        },
                        function getFollowedUser(row, by, nestedCallback) {
                            UserModel.findOne({username: row.blocked}, function (err, user) {
                                if (err) {
                                    return nestedCallback(err);
                                }
                                if (!user) {
                                    return nestedCallback(new Error('User not found: "' + row.blocked + '"'));
                                }
                                nestedCallback(null, row, by, user);
                            });
                        },
                        function add(row, by, user, nestedCallback) {
                            var blocked = new UserBlockedModel({
                                by: by._id,
                                user: user._id
                            });
                            blocked.save(function (err) {
                                nestedCallback(err);
                            });
                        }
                    ], function (err) {
                        count += 1;
                        if (err) {
                            errors += 1;
                        }
                        eachCallback(null);
                    });     
                }, function (err) {
                    callback(null, count, errors);
                });
            }
        ], function (err, count, errors) {
            connection.release();
            if (err) {
                console.log(err);
            }
            console.log('processed: ' + count + ', errors: ' + errors);
        }); 
    }
};
pool.getConnection(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    connection.query('SET NAMES utf8', function () {
        dataImport.blocked(connection);
    });
});