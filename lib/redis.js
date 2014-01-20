'use strict';
var redis = require('redis');

module.exports = (function () {
    var client = null;
    return {
        configure: function () {
            client = redis.createClient(6379, 'localhost');
            client.on('connect', function () {
                console.log('Connected to redis.');
            });
        },
        client: function () {
            return client;
        }
    };
}());
