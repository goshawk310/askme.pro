'use strict';
var passport = require('passport');

module.exports = function(server) {

    server.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'publish_actions', 'user_location']}));
    
    server.get('/auth/facebook/callback', 
        passport.authenticate('facebook', {
            successRedirect: '/', 
            failureRedirect: '/account/login'
        })
    );
};
