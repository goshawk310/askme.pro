askmePro.routerIndex = 'Profile';
askmePro.routers.Profile = Backbone.Router.extend({
    views: {},
    routes: {
        '': 'index',
        'info': 'info',
        'question/(:id)/likes': 'likes',
        'gifts': 'gifts'
    },
    index: function index() {
        $('#profile-menu li a[href="#"]').tab('show');
        if (typeof this.views.index === 'undefined') {
            this.views.index = new askmePro.views.ProfileIndexView();
            $('#profile-tabs-content').html(this.views.index.$el);
        } else {
            window.location.reload();
            return;
            $('#profile-tabs-content').html(this.views.index.$el);
            this.views.index.delegateEvents();
            _.each(this.views.index.questions, function (question) {
                question.delegateAllEvents();
            });
        }
    },
    info: function info() {
        $('#profile-menu li a[href="#info"]').tab('show');
        if (typeof this.views.info === 'undefined') {
            this.views.info = new askmePro.views.ProfileInfoView();
        }
        $('#profile-tabs-content').html(this.views.info.$el);
    },
    likes: function likes(id) {
        if (typeof this.views.index === 'undefined') {
            this.index();
        }
        if (typeof this.views.questionLikes === 'undefined') {
            this.views.questionLikes = new askmePro.views.QuestionLikesView();
            $('body').append(this.views.questionLikes.render().$el);
        }
        this.views.questionLikes.load(id, this);
    },
    gifts: function gifts() {
        if (typeof this.views.index === 'undefined') {
            this.index();
        }
        if (typeof this.views.profileGifts === 'undefined') {
            this.views.profileGifts = new askmePro.views.ProfileGiftsView({
                collection: new askmePro.collections.GiftCollection()
            });
            $('body').append(this.views.profileGifts.render().$el);
        }
        this.views.profileGifts.load(this);
    }
});
