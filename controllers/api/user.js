'use strict';
var User = require('../../models/user'),
  errorHandler = require('../../lib/error').handler;
module.exports = function (server) {
  server.param('login', /^[a-zA-Z0-9]+$/);
  
  server.get('/api/user/:login', function (req, res) {
    User.findOne({login: req.param('login')}, function (err, user) {
      if (err) {
        return errorHandler.db(err, res);
      } else if (user === null) {
        return res.send(404, {message: 'object not found'});
      }
      res.send(user);
    });
  });

  server.post('/api/user/create', function (req, res) {
    var user = new User(req.body);
    user.save(function (err, user) {
      if (err) {
        return errorHandler.db(err, res);
      }
      res.send(user);
    });
  });

  server.put('/api/user/update/:login', function (req, res) {
    User.update({login: req.param('login')}, req.body, function (err, numberAffected, raw) {
      if (err) {
        return errorHandler.db(err, res);
      }
      res.send(raw);
    });
  });
};
