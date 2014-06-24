'use strict';
var passport = require('passport');

module.exports = function(server) {

    server.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'user_location']}));
    
    server.get('/auth/facebook/callback', 
        passport.authenticate('facebook', {
            successRedirect: '/', 
            failureRedirect: '/account/login'
        }),
        function (err, req, res, next) {
            if (err) {
                console.log('fb err:');
                console.log(err);
                return res.redirect('/account/login');
            }
            next();
        }
    );
};
