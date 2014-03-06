var _ = require('underscore'),
    mysql = require('mysql'),
    pool  = mysql.createPool({
        host: '185.5.96.106',
        user: 'admin_ask',
        password: 'POgoda84',
        database: 'admin_ask'
    }),
    http = require('http'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development';
JSON.minify = JSON.minify || require('node-json-minify');
module.exports.db = {
    mysql: {
        mysql: mysql,
        pool: pool
    },
    mongo: function () {
        var file = '';
        if (env === 'production') {
            file = __dirname + '/../config/app.json';
        } else {
            file = __dirname + '/../config/app-'  + env + '.json';
        }
        var appConfig = JSON.parse(JSON.minify(fs.readFileSync(file, 'utf8')));
        require('../lib/database').config({
            host: appConfig.database.host,
            name: appConfig.database.name
        });
    }
};

module.exports.convertToUtf8 = function convertToUtf8(fields) {
    var mysql = 'TRIM(CONVERT(CAST(CONVERT(__field__ USING latin1) AS BINARY) USING utf8)) as __as_field__',
        convMysql = '',
        selectFields = [];
    _.each(fields, function (field) {
        convMysql = mysql.replace(/__field__/g, field).replace(/__as_field__/g, field.replace('.', '_'));
        convMysql = convMysql.replace(/__as_field__/g, field.replace('.', '_'));
        selectFields.push(convMysql);
    });
    return selectFields.join(', ');
};

module.exports.downloadFile = function downloadFile(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', function() {
                file.close();
                file.end();
                if (cb) {
                    cb(null, url, dest);
                }
            });
        } else {
            cb(new Error('404'));
        }
    });
    request.on('error', function (e) {
        console.log('get error: ' + e.message);
    });
};