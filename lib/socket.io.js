var io = require('socket.io'),
    RedisStore = require('socket.io/lib/stores/redis'),
    redis  = require('socket.io/node_modules/redis'),
    attribs = {
        io: null,
        socket: null,
        users: {}
    };
module.exports = {
    init: function init(server) {
        attribs.io = require('socket.io').listen(server, {log: false});
        attribs.io.sockets.on('connection', function(socket) {
            attribs.socket = socket;
            socket.on('hi', function (data) {
                attribs.users[data.id] = socket.id;
            });
        });
        attribs.io.configure(function () {
            attribs.io.set('browser client minification', true);
            attribs.io.set('transports', ['xhr-polling']); 
            attribs.io.set('polling duration', 10);
            var pub    = redis.createClient(),
                sub    = redis.createClient(),
                client = redis.createClient();
            attribs.io.set('store', new RedisStore({
                redisPub : pub,
                redisSub : sub,
                redisClient : client
            }));
        });

    },
    io: function io() {
        return attribs.io;
    },
    getSocket: function getSocket() {
        return attribs.socket;
    },
    getSocketId: function getSocketId(userId) {
        return attribs.users[userId] || null;
    }
};