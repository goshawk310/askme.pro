askmePro.routerIndex = 'Inbox';
askmePro.routers.Inbox = Backbone.Router.extend({
    views: {},
    routes: {
        '*path': 'index'
    },
    index: function index() {
        
        this.views.index = new askmePro.views.InboxIndexView();
        this.views.index.load();
    }
});
