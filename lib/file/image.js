var gm = require('gm'),
    fs = require('fs'),
    path = require('path');

var FileImage = function FileImage(filename, options) {
    this.filename = filename || null;
    this.options = options || {};
};

FileImage.prototype = {
    setFilename: function setFilename(value) {
        this.filename = value;
        return this;
    },
    getFilename: function getFilename() {
        return this.filename;
    },
    checkSize: function checkSize(callback) {
        gm(this.getFilename())
            .size(callback);
    },
    quality: function quality(value, callback) {
        var filename = this.getFilename(),
            thisObj = this;
        gm(filename)
            .quality(value)
            .write(filename, function (err) {
                if (err) {
                    return callback(err);
                }
                callback.call(thisObj, null);
            });
    },
    resize: function resize(width, height, callback) {
        var filename = this.getFilename(),
            thisObj = this;
        gm(filename)
            .resize(width, height)
            .write(filename, function (err) {
                if (err) {
                    return callback(err);
                }
                callback.call(thisObj, null);
            });
    },
    cropCenter: function cropCenter(callback) {
        var thisObj = this,
            fileName = this.getFilename(),
            readStream = fs.createReadStream(fileName);
        gm(readStream, path.basename(fileName)).size({bufferStream: true}, function (err, size) {
            if (err) {
                return callback(err);
            }
            var squareSize = size.width,
                ext = path.extname(fileName),
                dir = path.dirname(fileName) + '/' +  path.basename(fileName, ext);
            if (squareSize >= size.height) {
                squareSize = size.height;
            }
            fs.mkdirSync(dir);
            this.crop(squareSize, squareSize, (size.width / 2) - (squareSize / 2), (size.height / 2) - (squareSize / 2))
                .write(dir + '/cropped' + ext, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback.call(thisObj, null);
                });
        });
    }
};


module.exports = FileImage;