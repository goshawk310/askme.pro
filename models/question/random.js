'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate;

var QuestionRandom = function Question() {

    var schema = mongoose.Schema({
        contents: {
            type: String,
            required: true,
            validate: [validate('len', 1, 200)]
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true    
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User'
        }
    }, {
        collection: 'questions_random',
        autoIndex: false
    });
    
    return mongoose.model('QuestionRandom', schema);
};
module.exports = new QuestionRandom();
