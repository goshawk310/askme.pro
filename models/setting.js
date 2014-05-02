'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate;

var Setting = function() {

    var schema = mongoose.Schema({
        key: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: false
        }
    }, {
        collection: 'settings',
        autoIndex: false
    });
    
    return mongoose.model('Setting', schema);
};

module.exports = new Setting();
