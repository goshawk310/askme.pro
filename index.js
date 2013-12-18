'use strict';


var kraken = require('kraken-js'),
	db = require('./lib/database'),
	auth = require('./lib/auth'),
  app = {};


app.configure = function configure(nconf, next) {
    // Fired when an app configures itself
    //Configure the database
    db.config(nconf.get('database'));
    next(null);
};


app.requestStart = function requestStart(server) {
  // Fired at the beginning of an incoming request
  server.param(function(name, fn){
    if (fn instanceof RegExp) {
      return function(req, res, next, val) {
        var captures = fn.exec(String(val));
        if (captures) {
        	req.params[name] = captures[0];
          next();
        } else {
          next('route');
        }
      };
    }
  });

};


app.requestBeforeRoute = function requestBeforeRoute(server) {
  // Fired before routing occurs
  // Configure passport
  auth().init(server);
};


app.requestAfterRoute = function requestAfterRoute(server) {
  // Fired after routing occurs
};
kraken.create(app).listen(function (err) {
  if (err) {
    console.error(err);
  }
});
