'use strict';
var auth = require('../../lib/auth'),
    questionOfTheDay = require('../../services/question/ofTheDay');;

module.exports = function(server) {
    
    server.get('/admin/question-of-the-day', auth.hasPrivilegesOf('editor'), function (req, res) {
        questionOfTheDay.getTodays(function (err, question) {
            res.render('admin/question_of_the_day', {
                title: res.__('Pytanie dnia'),
                content: 'question_of_the_day',
                data: question
            });
        });
    });
};
