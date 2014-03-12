var io = require('socket.io'),
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