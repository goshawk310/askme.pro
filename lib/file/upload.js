var fs = require('fs'),
    crypto = require('crypto');

var FileUpload = function FileUpload(req, res, options) {
    this.req = req;
    this.res = res;
    this.options = options || {};
};

FileUpload.prototype = {
    getAllowedTypes: function getAllowedTypes() {
        return this.options.allowedTypes || [];
    },
    getDir: function getDir() {
        return this.options.dir || __dirname + '/../../public/uploads/';
    },
    getFileKey: function getFileKey() {
        return this.options.fileKey || null;
    },
    getPreProcess: function getPreProcess() {
        return this.options.preProcess || null;
    },
    getPostProcess: function getPostProcess() {
        return this.options.postProcess || null;
    },
    getRenameToken: function getRenameToken() {
        return this.options.renameToken;
    },
    setAllowedTypes: function setAllowedTypes(value) {
        this.options.allowedTypes = value;
        return this;
    },
    setDir: function setDir(value) {
        this.options.dir = value;
        return this;
    },
    setFileKey: function setFileKey(value) {
        this.options.fileKey = value;
        return this;
    },
    setPreProcess: function setPreProcess(value) {
        this.options.preProcess = value;
        return this;
    },
    setPostProcess: function setPostProcess(value) {
        this.options.postProcess = value;
        return this;
    },
    setRenameToken: function setRenameToken(value) {
        this.options.renameToken = value;
        return this;
    },
    one: function one(callback) {
        var allowedTypes = this.getAllowedTypes(),
            file  = this.req.files[this.getFileKey()] || null,
            thisObj = this,
            newFilename = '',
            preProcess = this.getPreProcess();
        if (!file) {
            thisObj.clearAll();
            console.log('Invalid fileKey provided: ' + file);
            return callback(new Error('Invalid fileKey provided.'), thisObj.req, thisObj.res);
        }
        if (!Object.prototype.toString.call(thisObj.req.files) === '[object Array]') {
            thisObj.clearAll();
            console.log('Multiple files upload not allowed.');
            return callback(new Error('Multiple files upload not allowed.'), thisObj.req, thisObj.res);
        } 
        if (allowedTypes.indexOf(file.type) < 0) {
            thisObj.clearAll();
            console.log('Not allowed file type.');
            return callback(new Error('Not allowed file type.'), thisObj.req, thisObj.res);
        }
        if (typeof preProcess === 'function') {
            preProcess.call(this, file, callback);
        } else {
            this.renameFile(file, callback);
        }
    },
    renameFile: function renameFile(file, callback) {
        var thisObj = this,
            dir = this.getDir(),
            newFilename = '',
            newBaseName = '',
            postProcess = this.getPostProcess();
        if (!this.getRenameToken()) {    
            this.setRenameToken((new Date()).getTime() + file.name);
        }
        fs.readFile(file.path, function(err, data) {
            if (err) {
                console.log(err);
                thisObj.clearAll();
                return callback(err, thisObj.req, thisObj.res);
            }
            newBaseName = crypto.createHash('md5').update(thisObj.getRenameToken()).digest('hex') +
                require('path').extname(file.name);
            newFilename = dir + newBaseName;    
            fs.writeFile(newFilename, data, function (err) {
                if (err) {
                    console.log(err);
                    thisObj.clearAll();
                    return callback(err, thisObj.req, thisObj.res);
                }
                thisObj.clearAll();
                if (typeof postProcess === 'function') {
                    postProcess.call(thisObj, newFilename, callback);
                } else {
                    return callback(null, thisObj.req, thisObj.res, newFilename);
                }
            });
        });
    },
    clearAll: function clearAll() {
        var file = null,
            fileKey = null;
        if (typeof this.req.files !== 'object') {
            console.log('FileUpload.clearAll failed!');
            return;
        }
        for (fileKey in this.req.files) {
            if (this.req.files.hasOwnProperty(fileKey)) {
                if (Object.prototype.toString.call(this.req.files[fileKey]) === '[object Array]') {
                    for (file in this.req.files[fileKey]) {
                        fs.unlink(file.path, function (err) {

                        });
                    }
                } else {
                    fs.unlink(this.req.files[fileKey].path, function (err) {

                    });
                }
            }
        }
    }
};


module.exports = FileUpload;