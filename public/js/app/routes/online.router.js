askmePro.routerIndex = 'Online';
askmePro.routers.Online = Backbone.Router.extend({
    views: {},
    routes: {
        '(:page)': 'index'
    },
    index: function index(page) {
        if (typeof this.views.online === 'undefined') {
            this.views.online = new askmePro.views.OnlineView({
                collection: new askmePro.collections.UsersCollection()
            });
            this.views.online.render();
        }
        $('#main-content-container').html(this.views.online.$el);
        this.views.online.load(parseInt(page, 10) || 0);
    }
});
