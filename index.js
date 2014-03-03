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
    var config = require('./config/app');
    server.locals({
        config: config
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
    
    server.param('username', new RegExp('^((?!' + config.reservedWords.join('|') + ')[a-zA-Z0-9\_\.\-])+$'));
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
    //admin menu
    server.use(function(req, res, next) {
        if (req.method.toLowerCase() === 'get' && req.isAuthenticated() && auth.hasPrivilegesOf('editor')) {
            var elements = [{
                    url: '/admin/question-of-the-day',
                    role: 'editor',
                    label: 'Pytanie dnia'
                }, {
                    url: '/admin/users', 
                    role: 'admin',
                    label: 'Użytkownicy'
                }
            ];
            for (var i = 0; i < elements.length; i += 1) {
                if (auth.getRoles()[req.user.role].indexOf(elements[i].role) < 0) {
                    elements.slice(i , i + 1);
                } else if (req.url === elements[i].url) {
                    elements[i].active = true;
                } else {
                    elements[i].active = false;
                }
            }
            res.locals.adminMenuElements = elements;
        } else {
            res.locals.adminMenuElements = null;
        }
        next();
    });
    //init dustjs custom helpers
    dustjsHelper(server).init(dust);
    server.use('/captcha.jpg', require('easy-captcha').generate());
};

app.requestAfterRoute = function requestAfterRoute(server) {
    // Fired after routing occurs
};

if (require.main === module) {
    kraken.create(app).listen(function (err, server) {
        if (err) {
            console.error(err.stack);
        }
        socketHelper.init(server);
    });
}
