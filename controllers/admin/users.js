'use strict';
var auth = require('../../lib/auth'),
    questionOfTheDay = require('../../services/question/ofTheDay');;

module.exports = function(server) {
    
    server.get('/admin/users', auth.hasPrivilegesOf('admin'), function (req, res) {
        res.render('admin/users', {
            title: res.__('Użytkownicy')
        });
    });
};
