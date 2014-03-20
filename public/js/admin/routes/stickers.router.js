askmePro.routerIndex = 'AdminStickersRouter';
askmePro.routers.AdminStickersRouter = Backbone.Router.extend({
    views: {},
    routes: {
        'add': 'add',
        '*path': 'index'
    },
    index: function index() {
        this.views.grid = new askmePro.views.AdminStickersGridView();
        this.views.grid.render();
    },
    add: function add() {
        this.views.actions = new askmePro.views.AdminStickerActionsView();
        this.views.actions.render();
    }
});
