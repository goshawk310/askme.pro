askmePro.routerIndex = 'Profile';
askmePro.routers.Profile = Backbone.Router.extend({
    views: {},
    routes: {
        '': 'index'
    },
    index: function index() {
        if ($('#profile-index-tpl').length && typeof this.views.index === 'undefined') {
            this.views.index = new askmePro.views.ProfileIndexView();
        }
    }
});
