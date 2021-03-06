'use strict';
var auth = require('../../lib/auth');

module.exports = function(server) {
    
    server.get('/admin/questions', auth.hasPrivilegesOf('moderator'), function (req, res) {
        res.render('admin/questions');
    });

    server.get('/admin/questions/random', auth.hasPrivilegesOf('admin'), function (req, res) {
        res.render('admin/questions/random');
    });
};
