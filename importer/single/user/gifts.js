var pool = require('../../common').db.mysql.pool,
    convertToUtf8 = require('../../common').convertToUtf8,
     _ = require('underscore'),
    async = require('async'),
    UserModel = require('../../../models/user'),
    UserGiftModel = require('../../../models/user/gift'),
    GiftModel = require('../../../models/gift'),
    username = process.argv[2] || '';
require('../../common').db.mongo();
var dataImport = {
    usersGifts: function users(connection) {
        var count = 0,
            errors = 0;
        async.waterfall([
            function get(callback) {
                var sql = 'SELECT *' +
                    ' FROM gifts' +
                    ' WHERE to_user = "' + username + '" OR from_user = "' + username + '"' ;
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
                        function getUserFrom(giftCallback) {
                            UserModel.findOne({username: row.from_user}, function (err, userFrom) {
                                if (err) {
                                    return giftCallback(err);
                                }
                                if (!userFrom) {
                                    return giftCallback(new Error('User not found: "' + row.to_user + '"'));
                                }
                                giftCallback(null, row, userFrom);
                            });
                        },
                        function getUserTo(row, userFrom, giftCallback) {
                            UserModel.findOne({username: row.to_user}, function (err, userTo) {
                                if (err) {
                                    return giftCallback(err);
                                }
                                if (!userTo) {
                                    return giftCallback(new Error('User not found: "' + row.to_user + '"'));
                                }
                                giftCallback(null, row, userFrom, userTo);
                            });
                        },
                        function getGift(row, userFrom, userTo, giftCallback) {
                            GiftModel.findOne({'sync.id': row.gift_id}, function (err, gift) {
                                if (err) {
                                    return giftCallback(err);
                                }
                                if (!gift) {
                                    return giftCallback(new Error('Gift not found: "' + row.gift_id + '"'));
                                }
                                giftCallback(null, row, userFrom, userTo, gift);
                            });
                        },
                        function add(row, userFrom, userTo, gift, giftCallback) {
                            var data = {
                                created_at: new Date(row.date),
                                gift: gift._id,
                                to: userTo._id,
                                from: userFrom._id,
                                sync: {
                                    id: row.id
                                }
                            },
                            type = parseInt(row.type, 10);
                            if (type === 2) {
                                data.type = 'public';
                            } else if (type === 1) {
                                data.type = 'private';
                            } else {
                                data.type = 'anonymous';
                            }
                            var userGift = new UserGiftModel(data);
                            userGift.save(function (err) {
                                giftCallback(err);
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
        return dataImport.usersGifts(connection);
    });
});