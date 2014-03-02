var pool = require('./common').db.mysql.pool,
    convertToUtf8 = require('./common').convertToUtf8,
     _ = require('underscore'),
    async = require('async'),
    UserModel = require('../models/user'),
    LikeModel = require('../models/like'),
    QuestionModel = require('../models/question'),
    settings = {
        page: 0,
        limit: 1000,
        errors: 0,
        overall: 0
    };
require('../lib/database').config({
    host: 'localhost',
    name: 'askme_pro'
});

var dataImport = {
    likes: function likes(connection, page) {
        var count = 0,
            errors = 0,
            limit = settings.limit,
            offset = page * limit;
        async.waterfall([
            function get(callback) {
                var sql = 'SELECT likes.*, ' + convertToUtf8([
                        'likes.user', 'likes.to_user'
                    ]) +
                    ' FROM likes INNER JOIN questions ON likes.q_id = questions.id ' +
                    ' LIMIT ' + offset + ', ' + limit;
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
                            if (row.likes_user === row.likes_to_user) {
                                return nestedCallback(new Error('Thats wierd, users cant do that!!!!'));
                            }
                            nestedCallback(null, row);
                        },
                        function getUserTo(row, nestedCallback) {
                            UserModel.findOne({username: row.likes_to_user}, function (err, userTo) {
                                if (err) {
                                    return nestedCallback(err);
                                }
                                if (!userTo) {
                                    return nestedCallback(new Error('User not found: "' + row.likes_to_user + '"'));
                                }
                                nestedCallback(null, row, userTo);
                            });
                        },
                        function getUserFrom(row, userTo, nestedCallback) {
                            UserModel.findOne({username: row.likes_user}, function (err, userFrom) {
                                if (err) {
                                    return nestedCallback(err);
                                }
                                if (!userFrom) {
                                    return nestedCallback(new Error('User not found: "' + row.likes_user + '"'));
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
    connection.query('SET NAMES utf8', function () {
        dataImport.likes(connection, settings.page);
    });
});