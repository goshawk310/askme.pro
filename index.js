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
    
    server.stack.some(function (middleware, idx, stack) {
        if (middleware.handle.name === 'favicon') {
            stack.splice(idx, 1);
            server.use(express.favicon(__dirname + '/public/favicon.ico'));
            return true;
        }
    });

    var config = require('./config/app');
    server.locals({
        config: config
    });
    server.use(function (req, res, next) {
        require('./services/setting').getAll(function (err, docs) {
            var settings = {};
            docs.forEach(function (doc) {
                settings[doc.key] = doc.value;
            });
            server.locals({
                siteSettings: settings
            });
            //banned ips
            if (settings.bannedIps && settings.bannedIps.length) {
                var ips = settings.bannedIps.split(' ');
                if (ips.indexOf(req.ip) > -1) {
                    return res.send(403);
                }
            }
            next();
        });
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
    server.param('username', new RegExp('^((?!' + config.reservedWords.join('|') + ')([a-zA-Z0-9\_\.\-])+)$'));
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
                    role: 'moderator',
                    label: 'Użytkownicy'
                }, {
                    url: '/admin/questions', 
                    role: 'moderator',
                    label: 'Pytania'
                }, {
                    url: '/admin/settings',
                    role: 'admin',
                    label: 'Ustawienia'
                }, {
                    url: '/admin/stickers',
                    role: 'admin',
                    label: 'Wstążki'
                }
            ];
            for (var i = 0; i < elements.length; i += 1) {
                if (auth.getRoles()[req.user.role].indexOf(elements[i].role) < 0) {
                    elements.splice(i , 1);
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
    server.use(function (req, res, next) {
        if (req.path.substr(0, 17) === '/uploads/avatars/') {
            res.status(404).sendfile('./public/images/default_avatar.png');
        } else if (req.path.substr(0, 21) === '/uploads/backgrounds/') {
            res.status(404).sendfile('./public/images/themes/default.png');
        } else {
            next();
        }
    });
};
kraken.create(app).listen(function (err, server) {
    if (err) {
        console.error(err.stack);
    }
    //socketHelper.init(server);
});