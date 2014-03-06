var pool = require('../common').db.mysql.pool,
    downloadFile = require('../common').downloadFile,
     _ = require('underscore'),
    async = require('async'),
    fs = require('fs'),
    UserModel = require('../../models/user'),
    FileImage = require('../../lib/file/image'),
    settings = {
        page: 0,
        limit: 20,
        processed: 0,
        errors: 0,
        overall: 0
    };
require('../common').db.mongo();
var dataImport = {
    avatars: function avatars(page) {
        var limit = settings.limit,
            offset = page * limit;
        async.waterfall([
            function getUsers(callback) {
                UserModel.find({'sync.avatar': {$ne: true}})
                .skip(offset)
                .limit(limit)
                .exec(callback);
            }, function checkUsers(users, callback) {
                if (!users || !users.length) {
                    callback(new Error('endOfImport'));
                } else {
                    callback(null, users);
                }
            }, function processAvatar(users, callback) {
                var filesProcessed = 0,
                    errors = 0,
                    index = 0;
                async.eachLimit(users, settings.limit / 2, function (user, eachCallback) {
                    if (!user.avatar || user.avatar === 'photo_default.png') {
                        return eachCallback();
                    }
                    downloadFile('http://askme.pro/media/images/users/b_' + user.avatar,
                    __dirname + '/../../uploads/avatars/' + user.avatar,
                    function (err, url, des) {
                        if (err) {
                            errors += 1;
                            return eachCallback();
                        }
                        var fileImage = new FileImage(des);
                        fileImage.quality(45, function (err) {
                            index += 1;
                            if (err) {
                                errors += 1;
                                fs.unlink(des);
                                return eachCallback();
                            }
                            this.cropCenter(function (err) {
                                index += 1;
                                if (err) {
                                    errors += 1;
                                    fs.unlink(des);
                                    return eachCallback();
                                }
                                filesProcessed += 1;
                                this.gmInstance = null;
                                delete this.gmInstance;
                                eachCallback();
                            });
                        });
                    });
                }, function (err) {
                    callback(null, users, filesProcessed, errors, index);
                });
            }
        ], 
        function (err, users, processed, errors, index) {
            if (err) {
                if (err.message && err.message === 'endOfImport') {
                    console.log(settings);
                    return console.log('END OF IMPORT');
                }
                console.log(err);
                console.log('restarting');
                settings = {
                    page: 0,
                    limit: 20,
                    processed: 0,
                    errors: 0,
                    overall: 0
                };
                dataImport.avatars(settings.page);
                return;
            }
            settings.errors += errors;
            settings.processed += processed;
            settings.overall += users.length;
            var ids = [];
            _.each(users, function (user) {
                ids.push(user._id);
            });
            UserModel.update({
                _id: {$in: ids}
            }, {
                'sync.avatar': true
            }, {
                multi: true
            }, function (err, numberAffected) {
                if (err) {
                    return console.log(err);
                }
                console.log('page: ' + settings.page + ', successful: ' + (users.length - errors) + ', processed: ' + processed + ', errors: ' + errors);
                settings.page += 1;
                dataImport.avatars(settings.page);
            });
        });      
    }
};
pool.getConnection(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    connection.query('SET NAMES utf8', function () {
        dataImport.avatars(connection, settings.page);
    });
});