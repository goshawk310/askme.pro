var pool = require('./common').db.mysql.pool,
    convertToUtf8 = require('./common').convertToUtf8,
     _ = require('underscore'),
    async = require('async'),
    UserModel = require('../models/user'),
    LikeModel = require('../models/like'),
    QuestionModel = require('../models/question'),
    minId = null,
    settings = {
        page: 0,
        limit: 1000,
        errors: 0,
        overall: 0
    };
require('./common').db.mongo();
var dataImport = {
    likes: function likes(connection, page) {
        var count = 0,
            errors = 0,
            limit = settings.limit,
            offset = page * limit;
        async.waterfall([
            function get(callback) {
                var sql = 'SELECT *' + 
                    ' FROM likes' +
                    (minId ? (' WHERE id > ' + minId) : '') +
                    ' ORDER BY id ASC LIMIT ' + offset + ', ' + limit;
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
                        function filter(nestedCallback) {
                            if (row.user === row.to_user) {
                                return nestedCallback(new Error('Thats wierd, users cant do that!!!!'));
                            }
                            nestedCallback(null, row);
                        },
                        function getUserTo(row, nestedCallback) {
                            UserModel.findOne({username: row.to_user}, function (err, userTo) {
                                if (err) {
                                    return nestedCallback(err);
                                }
                                if (!userTo) {
                                    return nestedCallback(new Error('User not found: "' + row.to_user + '"'));
                                }
                                nestedCallback(null, row, userTo);
                            });
                        },
                        function getUserFrom(row, userTo, nestedCallback) {
                            UserModel.findOne({username: row.user}, function (err, userFrom) {
                                if (err) {
                                    return nestedCallback(err);
                                }
                                if (!userFrom) {
                                    return nestedCallback(new Error('User not found: "' + row.user + '"'));
                                }
                                nestedCallback(null, row, userTo, userFrom);
                            });
                        },
                        function getQuestion(row, userTo, userFrom, nestedCallback) {
                            QuestionModel.findOne({'sync.id': row.q_id}, function (err, question) {
                                if (err) {
                                    return nestedCallback(err);
                                }
                                if (!question) {
                                    return nestedCallback(new Error('Question not found: "' + row.q_id + '"'));
                                }
                                nestedCallback(null, row, userTo, userFrom, question);
                            });
                        },
                        function add(row, userTo, userFrom, question, nestedCallback) {
                            var like = new LikeModel({
                                question_id: question._id,
                                from: userFrom._id,
                                to: userTo._id,
                                sync: {
                                    id: row.id
                                }
                            });
                            like.save(function (err) {
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
                if (err.message && err.message === 'endOfImport') {
                    console.log(settings);
                    return console.log('END OF IMPORT');
                }
                return console.log(err);
            }
            settings.errors += errors;
            settings.overall += count;
            console.log('page: ' + settings.page + ', processed: ' + count + ', errors: ' + errors);
            settings.page += 1;
            dataImport.likes(connection, settings.page);
        }); 
    }
};
pool.getConnection(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    return dataImport.likes(connection, settings.page);
    connection.query('SET NAMES utf8', function () {
        LikeModel.find({})
        .sort({'sync.id': -1})
        .limit(1)
        .exec(function (err, rows) {
            if (err) {
                return console.log(err);
            }
            if (rows && rows.length && rows[0].sync && rows[0].sync.id) {
                minId = rows[0].sync.id;
            }
            dataImport.likes(connection, settings.page);
        });
    });
});