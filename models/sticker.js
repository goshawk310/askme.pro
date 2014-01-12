'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate;

var Sticker = function() {

    var schema = mongoose.Schema({
        file: {
            type: String,
            index: {
                unique: true
            },
            required: true,
            validate: [validate('len', 1, 200)]
        },
        name: {
            type: String,
            required: true
        }
    }, {
        collection: 'stickers',
        autoIndex: false
    });
    
    return mongoose.model('Sticker', schema);
};

module.exports = new Sticker();
