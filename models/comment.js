'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    QuestionModel = require('./question');

var Comment = function() {

    var schema = mongoose.Schema({
        created_at: {
            type: Date,
            required: true
        },
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Question',
            index: true
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
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

    /**
     * pre save
     * @param  {Function} next
     * @return void
     */
    schema.pre('validate', function(next) {
        if (this.isNew) {
            this.created_at = new Date();
        }
        next();
    });
    
    /**
     * pre save
     * @param  {Function} next
     * @return void
     */
    schema.pre('save', function(next) {
        this.wasNew = this.isNew;
        if (this.isNew) {
            this.created_at = new Date();
        }
        next();
    });

    /**
     * post init middleware 
     * @return {void}
     */
    schema.post('init', function() {
        this._original = this.toObject();
    });

    /**
     * post save middleware
     * @return {void}
     */
    schema.post('save', function(comment) {
        if (this.wasNew) {
            QuestionModel.update({
                _id: comment.question_id
            }, {
                $inc: {'stats.comments': 1}
            }, function (err, user) {
            
            });
        }
    });

    /**
     * post remove middleware
     * @return {void}
     */
    schema.post('remove', function(comment) {
        QuestionModel.update({
            _id: comment.question_id
        }, {
            $inc: {'stats.comments': -1}
        }, function (err, user) {
        
        });
    });

    return mongoose.model('Comment', schema);
};

module.exports = new Comment();
