'use strict';
var User = require('../../models/user'),
  errorHandler = require('../../lib/error').handler;
module.exports = function (server) {
  server.param('username', /^[a-zA-Z0-9]+$/);
  
  server.get('/api/user/:username', function (req, res) {
    User.findOne({username: req.param('username')}, function (err, user) {
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

  server.put('/api/user/update/:username', function (req, res) {
    User.update({username: req.param('username')}, req.body, function (err, numberAffected, raw) {
      if (err) {
        return errorHandler.db(err, res);
      }
      res.send(raw);
    });
  });
};
