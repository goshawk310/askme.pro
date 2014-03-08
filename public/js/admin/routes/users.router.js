askmePro.routerIndex = 'AdminUsersRouter';
askmePro.routers.AdminUsersRouter = Backbone.Router.extend({
    views: {},
    routes: {
        '*path': 'index'
    },
    index: function index() {
        this.views.grid = new askmePro.views.AdminUsersGridView();
        this.views.grid.render();
    }
});
