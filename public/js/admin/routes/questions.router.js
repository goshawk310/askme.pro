askmePro.routerIndex = 'AdminQuestionsRouter';
askmePro.routers.AdminQuestionsRouter = Backbone.Router.extend({
    views: {},
    routes: {
        '*path': 'index'
    },
    index: function index() {
        this.views.grid = new askmePro.views.AdminQuestionsGridView();
        this.views.grid.render();
    }
});
