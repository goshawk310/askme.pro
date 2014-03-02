var _ = require('underscore'),
    mysql = require('mysql'),
    pool  = mysql.createPool({
        host: '185.5.96.106',
        user: 'admin_ask',
        password: 'POgoda84',
        database: 'admin_ask'
    }),
    http = require('http'),
    fs = require('fs');

module.exports.db = {
    mysql: {
        mysql: mysql,
        pool: pool
    }
};

module.exports.convertToUtf8 = function convertToUtf8(fields) {
    var mysql = 'TRIM(CONVERT(CAST(CONVERT(__field__ USING latin1) AS BINARY) USING utf8)) as __as_field__',
        selectFields = [];
    _.each(fields, function (field) {
        mysql = mysql.replace(/__field__/g, field);
        mysql = mysql.replace(/__as_field__/g, field.replace('.', '_'));
        selectFields.push(mysql);
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