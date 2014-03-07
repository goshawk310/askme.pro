'use strict';
var mongoose = require('mongoose');

module.exports = {
    config: function(database) {
        mongoose.connect('mongodb://' + database.host + '/' + database.name, database);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function callback() {
            console.log('db connection open');
        });
    },
    translateErrorMessages: function translateErrorMessages() {

    }
};
