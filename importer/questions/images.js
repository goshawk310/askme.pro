var downloadFile = require('../common').downloadFile,
     _ = require('underscore'),
    async = require('async'),
    fs = require('fs'),
    QuestionModel = require('../../models/question'),
    FileImage = require('../../lib/file/image'),
    settings = {
        page: 0,
        limit: 20,
        processed: 0,
        errors: 0,
        overall: 0
    };
require('../../lib/database').config({
    host: 'localhost',
    name: 'askme_pro'
});    
var dataImport = {
    images: function images(page) {
        var limit = settings.limit,
            offset = page * limit;
        async.waterfall([
            function getQuestions(callback) {
                QuestionModel.find({$and: [{'sync.image': {$ne: true}}, {image: {$ne: null}}]})
                .skip(offset)
                .limit(limit)
                .exec(function (err, rows) {
                    callback(err, rows);
                });
            }, function check(rows, callback) {
                if (!rows || !rows.length) {
                    callback(new Error('endOfImport'));
                } else {
                    callback(null, rows);
                }
            }, function process(rows, callback) {
                var filesProcessed = 0,
                    errors = 0,
                    index = 0;
                async.eachLimit(rows, settings.limit / 2, function (row, eachCallback) {
                    if (!row.image) {
                        return eachCallback();
                    }
                    downloadFile('http://askme.pro/media/images/answers/' + row.image,
                    __dirname + '/../../uploads/answers/' + row.image,
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
                            filesProcessed += 1;
                            this.gmInstance = null;
                            delete this.gmInstance;
                            eachCallback();
                        });
                    });
                }, function (err) {
                    callback(null, rows, filesProcessed, errors, index);
                });
            }
        ], 
        function (err, rows, processed, errors, index) {
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
                dataImport.images(settings.page);
                return;
            }
            settings.errors += errors;
            settings.processed += processed;
            settings.overall += rows.length;
            var ids = [];
            _.each(rows, function (row) {
                ids.push(row._id);
            });
            QuestionModel.update({
                _id: {$in: ids}
            }, {
                'sync.avatar': true
            }, {
                multi: true
            }, function (err, numberAffected) {
                if (err) {
                    return console.log(err);
                }
                console.log('page: ' + settings.page + ', successful: ' + (rows.length - errors) + ', processed: ' + processed + ', errors: ' + errors);
                settings.page += 1;
                dataImport.images(settings.page);
            });
        });
    }
};
dataImport.images(settings.page);
