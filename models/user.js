'use strict';
var mongoose = require('mongoose');
var User = function () {
	var schema = mongoose.Schema({
		name: {type: String, index: {unique: true}}
	}, {
		collection: 'user'
	});
	return mongoose.model('User', schema);
};
module.exports = new User();