'use strict';

module.exports = function (server) {

	server.param('locale', /^[a-zA-Z]{2}$/);

    server.get('/', function (req, res) {
    	if (req.isAuthenticated()) {
    		return res.redirect('/site/activity');
    	}
        res.render('index');
    });

    server.get('/locale/:locale', function (req, res) {
    	res.cookie('locale', req.param('locale'), { maxAge: 900000, httpOnly: true });
    	res.setLocale(req.param('locale'));
    	res.redirect('back');
    });
};
