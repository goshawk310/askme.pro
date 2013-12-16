'use strict';
var mongoose = require('mongoose');
var db = function () {
  return {
    config: function (database) {
      mongoose.connect('mongodb://' + database.host + '/' + database.name);
      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function callback() {
        console.log('db connection open');
      });
    }
  };
};
module.exports = db();