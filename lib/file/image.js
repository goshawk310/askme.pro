var gm = require('gm');

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
        var filename = this.getFilename();
        gm(filename)
            .quality(value)
            .write(filename, callback);
    }
};


module.exports = FileImage;