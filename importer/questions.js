var pool = require('./common').db.mysql.pool,
    convertToUtf8 = require('./common').convertToUtf8,
     _ = require('underscore'),
    async = require('async'),
    UserModel = require('../models/user'),
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
    questions: function questions(connection, page) {
        var count = 0,
            errors = 0,
            limit = settings.limit,
            offset = page * limit;
        async.waterfall([
            function get(callback) {
                var sql = 'SELECT id, to_user, from_user, image, status, viewed, anonymous, date, ip, time, answer_timestamp, ' +
                    convertToUtf8([
                        'question', 'answer'
                    ]) +
                    ' FROM questions' +
                    (minId ? (' WHERE id > ' + minId) : '') +
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
                        function getUserTo(nestedCallback) {
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
                            UserModel.findOne({username: row.from_user}, function (err, userFrom) {
                                if (err) {
                                    return nestedCallback(err);
                                }
                                nestedCallback(null, row, userTo, userFrom);
                            });
                        },
                        function add(row, userTo, userFrom, nestedCallback) {
                            var data = {
                                to: userTo._id,
                                from: parseInt(row.anonymous, 10) === 1 || !userFrom ? null : userFrom._id,
                                og_from: parseInt(row.anonymous, 10) === 0 && userFrom ? userFrom._id : null,
                                contents: row.question,
                                answer: row.answer || null,
                                answered_at: row.answer ? new Date(row.date.split('-').reverse().join('-') + ' ' + row.time) : null,
                                image: row.image || null,
                                ip: row.ip,
                                sync: {
                                    id: row.id
                                }
                            };
                            var question = new QuestionModel(data);
                            question.save(function (err) {
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
            dataImport.questions(connection, settings.page);
        }); 
    }
};
pool.getConnection(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    connection.query('SET NAMES utf8', function () {
        QuestionModel.find({})
        .sort({'sync.id': -1})
        .limit(1)
        .exec(function (err, rows) {
            if (err) {
                return console.log(err);
            }
            if (rows && rows.length && rows[0].sync && rows[0].sync.id) {
                minId = rows[0].sync.id;
            }
            dataImport.questions(connection, settings.page);
        });
    });
});