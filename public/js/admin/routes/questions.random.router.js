askmePro.routerIndex = 'AdminQuestionsRandomRouter';
askmePro.routers.AdminQuestionsRandomRouter = Backbone.Router.extend({
    views: {},
    routes: {
        'add': 'add',
        '*path': 'index'
    },
    index: function index() {
        this.views.grid = new askmePro.views.AdminQuestionsRandomGridView();
        this.views.grid.render();
    },
    add: function add() {
        this.views.actions = new askmePro.views.AdminQuestionsRandomActionsView();
        this.views.actions.render();
    }
});
