askmePro.routerIndex = 'AdminUserImagesRouter';
askmePro.routers.AdminUserImagesRouter = Backbone.Router.extend({
    views: {},
    routes: {
        '*path': 'index'
    },
    index: function index(query) {
    	this.views.grid = new askmePro.views.AdminUserImagesGridView({
        	queryData: {query: query}
        });
        this.views.grid.render();
    }
});
