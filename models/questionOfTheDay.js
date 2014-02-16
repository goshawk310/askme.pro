'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate;

var QuestionOfTheDay = function Question() {

    var schema = mongoose.Schema({
        contents: {
            type: String,
            required: true,
            validate: [validate('len', 1, 200)]
        }
    }, {
        collection: 'questions_of_the_day',
        autoIndex: false
    });
    
    return mongoose.model('QuestionOfTheDay', schema);
};
module.exports = new QuestionOfTheDay();
