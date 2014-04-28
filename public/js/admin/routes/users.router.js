askmePro.routerIndex = 'AdminUsersRouter';
askmePro.routers.AdminUsersRouter = Backbone.Router.extend({
    views: {},
    routes: {
        '*path': 'index'
    },
    index: function index(query) {
    	this.views.grid = new askmePro.views.AdminUsersGridView({
        	queryData: {query: query}
        });
        this.views.grid.render();
    }
});
