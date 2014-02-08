askmePro.routerIndex = 'Stream';
askmePro.routers.Stream = Backbone.Router.extend({
    views: {},
    routes: {
        '*path': 'index'
    },
    index: function index() {
        if (typeof this.views.stream === 'undefined') {
            this.views.stream = new askmePro.views.StreamView({
                collection: new askmePro.collections.QuestionCollection()
            });
            this.views.stream.render();
        }
        $('#main-content-container').html(this.views.stream.$el);
        this.views.stream.load();
    }
});
