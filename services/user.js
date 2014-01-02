'use strict';
var UserModel = require('../models/user'),
	userSchema = require('mongoose').model('User');
module.exports = {
	signup: function signup(req, res, callback) {
		UserModel.schema.path('password').validate(function (password) {
			return password == req.body.password2;
		}, 'Passwords do not match.');
		var user = new UserModel(req.body);
		user.save(function (err, user) {
			callback(req, res, user, err);
		});
	}
};
