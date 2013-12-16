'use strict';
module.exports = function (server) {
  server.param('name', /^[a-zA-Z0-9]+$/);
  server.get('/api', function(req, res) {
    res.end('asdasd');
  });
  server.get('/api/:name', function (req, res) {
   res.end('xxx');
  });
  server.get(/^\/api(?:\/([^\/]+?))?\/?$/i, function(req, res) {
    res.end(req.param('id'));
    console.log(req.params);
  });
};
