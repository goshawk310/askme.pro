'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate;

var Gift = function() {

    var schema = mongoose.Schema({
        file: {
            type: String,
            required: true,
            validate: [validate('len', 1, 200)]
        },
        name: {
            type: String,
            required: false
        },
        old_id: {
            type: Number,
            required: false
        }
    }, {
        collection: 'gifts',
        autoIndex: false
    });
    
    return mongoose.model('Gift', schema);
};

module.exports = new Gift();
