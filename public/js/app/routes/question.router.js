askmePro.routerIndex = 'Question';
askmePro.routers.Question = Backbone.Router.extend({
    views: {},
    routes: {
        '*path': 'index'
    },
    index: function index() {
        if (typeof this.views.question === 'undefined') {
            this.views.question = new askmePro.views.QuestionView({
                model: new askmePro.models.QuestionModel(JSON.parse($('#question-data').html()))
            });
            this.views.question.render();
        }
        $('#answers-container').html(this.views.question.$el);
        this.views.question.$el.find('.btn-comments').trigger('click');
        this.views.question.$el.find('.question-settings').remove();
    
        if (typeof this.views.top === 'undefined') {
            this.views.top = new askmePro.views.QuestionProfileTopView({
                model: new askmePro.models.UserModel({
                    _id: this.views.question.model.get('to')._id
                })
            });
            this.views.top.delegateEvents();
        }
    }
});
