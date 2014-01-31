askmePro.routerIndex = 'Activity';
askmePro.routers.Activity = Backbone.Router.extend({
    views: {},
    routes: {
        '': 'index'
    },
    index: function index() {
        if (typeof this.views.activity === 'undefined') {
            this.views.activity = new askmePro.views.IndexActivityView({
                collection: new askmePro.collections.QuestionCollection()
            });
            this.views.activity.render();
        }
        $('#main-content-container').html(this.views.activity.$el);
        
        this.views.activity.load();
    }
});
