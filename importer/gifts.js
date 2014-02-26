var pool = require('./common').db.mysql.pool,
    downloadFile = require('./common').downloadFile
     _ = require('underscore'),
    async = require('async'),
    GiftModel = require('../models/gift');
require('../lib/database').config({
    host: 'localhost',
    name: 'askme_pro'
});

var dataImport = {
    gifts: function gifts(connection) {
        async.waterfall([
            function get(callback) {
                connection.query('SELECT * FROM giftstype', function (err, rows) {
                    callback(err, rows);
                });
            }, function check(rows, callback) {
                if (!rows || !rows.length) {
                    (new Error('noRows'));
                } else {
                    callback(null, rows);
                }
            }, function add(rows, callback) {
                async.eachLimit(rows, 50, function (row, eachCallback) {
                    downloadFile('http://askme.pro/media/images/gifts/' + row.image,
                    __dirname + '/../uploads/gifts/' + row.image,
                    function (url, des) {

                    });
                    (new GiftModel({
                        old_id: row.id,
                        name: row.name,
                        file: row.image
                    })).save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                        eachCallback()
                    });    
                }, function (err) {
                    callback(null);
                });
            }
        ], 
        function (err) {
            connection.release();
            if (err) {
                if (err.message && err.message === 'noRows') {
                    return console.log('NO ROWS');
                }
                console.log(err);
                return;
            }
            return console.log('THE END');
        });      
    }
};
pool.getConnection(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    connection.query('SET NAMES utf8', function () {
        dataImport.gifts(connection);
    });
});