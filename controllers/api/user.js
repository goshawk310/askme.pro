'use strict';
var User = require('../../models/user');
module.exports = function (server) {
  server.param('name', /^[a-zA-Z0-9]+$/);
  server.get('/api/user/:name', function (req, res) {
   res.set('Content-Type', 'text/html');
   res.send(req.param('name'));
  });
  server.post('/api/user/create', function (req, res) {
    var user = new User({
      name: req.body.name
    });
    user.save(function (err, user) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(user);
    });
  });
};
