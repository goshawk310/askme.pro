'use strict';
var auth = require('../../../lib/auth');

module.exports = function(server) {
    
    server.post('/admin/question-of-the-day', auth.hasPrivilegesOf('editor'), function (req, res) {
        res.render('admin', {
            title: res.__('Pytanie dnia'),
            content: 'question_of_the_day'
        });
    });

};
