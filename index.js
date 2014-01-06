'use strict';


var kraken = require('kraken-js'),
    db = require('./lib/database'),
    flash = require('connect-flash'),
    auth = require('./lib/auth'),
    dust = require('dustjs-helpers'),
    i18n = require('i18n'),
    dustjsHelper = require('./lib/dustjs/helpers'),
    app = {};

app.configure = function configure(nconf, next) {
    // Fired when an app configures itself
    //Configure the database
    db.config(nconf.get('database'));
    //Configure i18n
    i18n.configure(nconf.get('middleware').i18n);
    next(null);
};

app.requestStart = function requestStart(server) {
    // Fired at the beginning of an incoming request
    server.param(function(name, fn) {
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
    server.use(flash());
    // Configure passport
    auth().init(server);
    server.use(i18n.init);
};

app.requestAfterRoute = function requestAfterRoute(server) {
    // Fired after routing occurs
    dustjsHelper(server).init(dust);
};
kraken.create(app).listen(function(err) {
    if (err) {
        console.error(err);
    }
});
