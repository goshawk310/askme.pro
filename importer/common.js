var _ = require('underscore'),
    mysql = require('mysql'),
    pool  = mysql.createPool({
        host: '185.5.96.106',
        user: 'admin_ask',
        password: 'POgoda84',
        database: 'admin_ask'
    });

module.exports.db = {
    mysql: {
        mysql: mysql,
        pool: pool
    }
};

module.exports.convertToUtf8 = function convertToUtf8(fields) {
    var mysql = 'TRIM(CONVERT(CAST(CONVERT(__field__ USING latin1) AS BINARY) USING utf8)) as __field__',
        selectFields = [];
    _.each(fields, function (field) {
        selectFields.push(mysql.replace(/__field__/g, field));
    });
    return selectFields.join(', ');
};