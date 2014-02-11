askmePro.routerIndex = 'Search';
askmePro.routers.Search = Backbone.Router.extend({
    views: {},
    routes: {
        '(:page)': 'index'
    },
    index: function index(page) {
        if (typeof this.views.search === 'undefined') {
            this.views.search = new askmePro.views.SearchView({
                collection: new askmePro.collections.UsersCollection()
            });
            this.views.search.render();
        }
        this.views.search.load(parseInt(page, 10));
    }
});
