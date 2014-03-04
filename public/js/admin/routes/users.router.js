askmePro.routerIndex = 'AdminUsersRouter';
askmePro.routers.AdminUsersRouter = Backbone.Router.extend({
    routes: {
        '*path': 'index'
    },
    index: function index() {
        var collection = new askmePro.collections.UsersCollection({
            url: '/xxxx'
        });
        collection.fetch({

        });
    }
});
