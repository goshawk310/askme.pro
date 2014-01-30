askmePro.routerIndex = 'Profile';
askmePro.routers.Profile = Backbone.Router.extend({
    views: {},
    routes: {
        'info': 'info',
        'questions/(:id)/likes': 'likes',
        'gifts/send': 'sendGifts',
        'gifts(/:page)': 'gifts',
        'follows(/:page)': 'follows',
        'followers(/:page)': 'followers',
        'photos(/:page)': 'photos',
        'videos(/:page)': 'videos',
        '*path': 'index'
    },
    index: function index(path) {
        $('#profile-stats-container').children('.btn').removeClass('active');
        $('#profile-stats-link-answers').addClass('active');
        $('#profile-menu li a[href="#"]').tab('show');
        $('#profile-top').removeClass('small');
        $('#profile-stats-wrapper').show();
        if (typeof this.views.index === 'undefined') {
            this.views.index = new askmePro.views.ProfileIndexView({
                path: path
            });
            if ($('#gifts-data').length && $('#gifts-data').html().length) {
                this.views.index.loadGifts(JSON.parse($('#gifts-data').html()), $('#gifts-data').data('editable'));
            }
            $('#profile-tabs-content').html(this.views.index.$el);
        } else {
            window.location.reload();
            return;
        }
    },
    info: function info() {
        $('#profile-menu li a[href="#info"]').tab('show');
        $('#profile-top').removeClass('gifts-visible').addClass('small');
        $('#profile-stats-wrapper').hide();
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
    sendGifts: function sendGifts() {
        if (typeof this.views.index === 'undefined') {
            this.index();
        }
        if (typeof this.views.profileSendGifts === 'undefined') {
            this.views.profileSendGifts = new askmePro.views.ProfileSendGiftsView({
                collection: new askmePro.collections.GiftCollection()
            });
            $('body').append(this.views.profileSendGifts.render().$el);
        }
        this.views.profileSendGifts.load(this);
    },
    gifts: function gifts(page) {
        $('#profile-stats-container').children('.btn').removeClass('active');
        $('#profile-stats-link-gifts').addClass('active');
        $('#profile-top').removeClass('gifts-visible').addClass('small');
        $('#profile-stats-wrapper').show();

        if (typeof this.views.profileGifts === 'undefined') {
            this.views.profileGifts = new askmePro.views.ProfileGiftsView({
                collection: new askmePro.collections.GiftCollection()
            });
            $('#profile-tabs-content').html(this.views.profileGifts.render().$el);
        } else {
            $('#profile-tabs-content').html(this.views.profileGifts.$el);
        }
        this.views.profileGifts.load(parseInt(page, 10) || 0);
    },
    follows: function follows(page) {
        $('#profile-stats-container').children('.btn').removeClass('active');
        $('#profile-stats-link-follows').addClass('active');
        $('#profile-top').removeClass('gifts-visible').addClass('small');
        $('#profile-stats-wrapper').show();
        if (typeof this.views.profileFollows === 'undefined') {
            this.views.profileFollows = new askmePro.views.ProfileFollowsView({
                collection: new askmePro.collections.UsersCollection()
            });
            $('#profile-tabs-content').html(this.views.profileFollows.render().$el);
        } else {
            $('#profile-tabs-content').html(this.views.profileFollows.$el);
        }
        this.views.profileFollows.load(parseInt(page, 10) || 0);
    },
    followers: function followers(page) {
        $('#profile-stats-container').children('.btn').removeClass('active');
        $('#profile-stats-link-followers').addClass('active');
        $('#profile-top').removeClass('gifts-visible').addClass('small');
        $('#profile-stats-wrapper').show();
        if (typeof this.views.profileFollowers === 'undefined') {
            this.views.profileFollowers = new askmePro.views.ProfileFollowersView({
                collection: new askmePro.collections.UsersCollection()
            });
            $('#profile-tabs-content').html(this.views.profileFollowers.render().$el);
        } else {
            $('#profile-tabs-content').html(this.views.profileFollowers.$el);
        }
        this.views.profileFollowers.load(parseInt(page, 10) || 0);
    },
    photos: function photos(page) {
        $('#profile-menu li a[href="#photos"]').tab('show');
        $('#profile-top').removeClass('gifts-visible').addClass('small');
        $('#profile-stats-wrapper').hide();
        if (typeof this.views.profilePhotos === 'undefined') {
            this.views.profilePhotos = new askmePro.views.ProfilePhotosView({
                collection: new askmePro.collections.PhotosCollection()
            });
            $('#profile-tabs-content').html(this.views.profilePhotos.render().$el);
        } else {
            $('#profile-tabs-content').html(this.views.profilePhotos.$el);
        }
        this.views.profilePhotos.load(parseInt(page, 10) || 0);;
    },
    videos: function videos(page) {
        $('#profile-menu li a[href="#videos"]').tab('show');
        $('#profile-top').removeClass('gifts-visible').addClass('small');
        $('#profile-stats-wrapper').hide();
        if (typeof this.views.profileVideos === 'undefined') {
            this.views.profileVideos = new askmePro.views.ProfileVideosView({
                collection: new askmePro.collections.VideosCollection()
            });
            $('#profile-tabs-content').html(this.views.profileVideos.render().$el);
        } else {
            $('#profile-tabs-content').html(this.views.profileVideos.$el);
        }
        this.views.profileVideos.load(parseInt(page, 10) || 0);;
    }
});
