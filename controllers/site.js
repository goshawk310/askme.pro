'use strict';

module.exports = function(server) {

    server.get('/site/activity', function(req, res) {
        if (!req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.render('site/activity');
    });

};
