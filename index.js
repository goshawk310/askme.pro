'use strict';


var kraken = require('kraken-js'),
    db = require('./lib/database'),
    flash = require('connect-flash'),
    auth = require('./lib/auth'),
    dust = require('dustjs-helpers'),
    i18n = require('i18n'),
    dustjsHelper = require('./lib/dustjs/helpers'),
    express = require('express'),
    redisClient = require('./lib/redis'),
    socketHelper = require('./lib/socket.io.js'),
    app = {};
app.configure = function configure(nconf, next) {
    // Fired when an app configures itself
    //Configure the database
    db.config(nconf.get('database'));
    //Configure i18n
    i18n.configure(nconf.get('middleware').i18n);
    //configure passport
    auth.configure(i18n);
    //configure redis client
    redisClient.configure();
    
    next(null);
};

app.requestStart = function requestStart(server) {
    // Fired at the beginning of an incoming request
    server.locals({
        config: require('./config/app')
    });
    require('./lib/uploads')(server, __dirname);
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
    server.param('username', /^[a-zA-Z0-9]+$/);
    server.param('locale', /^[a-zA-Z]{2}$/);
    server.param('id', /^[a-zA-Z0-9]+$/);
};

app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Fired before routing occurs
    server.use(express.methodOverride());
    server.use(i18n.init);
    server.use(function (req, res, next) {
        i18n.setLocale(res.getLocale());
        server.set('i18n', i18n);
        next();
    });
    server.use(flash());
    //init passport
    auth.init(server);
    //init dustjs custom helpers
    dustjsHelper(server).init(dust);
};

app.requestAfterRoute = function requestAfterRoute(server) {
    // Fired after routing occurs
    server.use('/captcha.jpg', require('easy-captcha').generate());
};

if (require.main === module) {
    kraken.create(app).listen(function (err, server) {
        if (err) {
            console.error(err.stack);
        }
        socketHelper.init(server);
    });
}
