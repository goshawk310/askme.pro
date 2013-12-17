'use strict';

var mongoose = require('mongoose'),
	validate = require('mongoose-validator').validate;

var User = function () {
	
	var schema = mongoose.Schema({
		username: {
			type: String, 
			index: {unique: true}, 
			required: true, 
			validate: [validate('len', 4, 20), validate('isAlphanumeric')]
		},
		password: {
			type: String, 
			required: true
		},
		email: {
			type: String, 
			required: true, 
			index: {unique: true}, 
			valiadate: [validate('isEmail')]
		},
		name: {
			type: String, required: true
		},
		lastname: {
			type: String, required: true
		}
	}, {
		collection: 'user'
	});

	return mongoose.model('User', schema);
};

module.exports = new User();