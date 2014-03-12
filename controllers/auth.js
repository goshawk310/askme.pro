'use strict';
var passport = require('passport');

module.exports = function(server) {

    server.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'publish_actions']}));
    
    server.get('/auth/facebook/callback', 
        passport.authenticate('facebook', {
            successRedirect: '/', 
            failureRedirect: '/account/login'
        })
    );
};
