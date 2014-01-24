'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate;

var Comment = function() {

    var schema = mongoose.Schema({
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Question',
            index: true
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        contents: {
            type: String,
            required: true,
            validate: [validate('len', 1, 200)]
        },
        viewed: {
            type: Boolean,
            default: false
        }
    }, {
        collection: 'comments',
        autoIndex: false
    });
    
    return mongoose.model('Comment', schema);
};

module.exports = new Comment();
