askmePro.routerIndex = 'Profile';
askmePro.routers.Profile = Backbone.Router.extend({
    views: {},
    routes: {
        '': 'index',
        'info': 'info'
    },
    index: function index() {
        $('#profile-menu li a[href="#"]').tab('show');
        if (typeof this.views.index === 'undefined') {
            this.views.index = new askmePro.views.ProfileIndexView();
        }
        $('#profile-tabs-content').html(this.views.index.$el);
    },
    info: function info() {
        $('#profile-menu li a[href="#info"]').tab('show');
        if (typeof this.views.info === 'undefined') {
            this.views.info = new askmePro.views.ProfileInfoView();
        }
        $('#profile-tabs-content').html(this.views.info.$el);
    }
});
