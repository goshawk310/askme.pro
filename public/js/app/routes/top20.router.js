askmePro.routerIndex = 'Top20';
askmePro.routers.Top20 = Backbone.Router.extend({
    views: {},
    routes: {
        'followers': 'followers',
        'likes': 'likes',
        '*path': 'index'
    },
    index: function index() {
        $('#top20-tabs li a[href="#top20-points"]').tab('show');
        if (typeof this.views.points === 'undefined') {
            this.views.points = new askmePro.views.Top20PointsView({
                collection: new askmePro.collections.UsersCollection()
            });
            this.views.points.render();
            this.views.points.load();
        }
    },
    likes: function likes() {
        $('#top20-tabs li a[href="#top20-likes"]').tab('show');
        if (typeof this.views.likes === 'undefined') {
            this.views.likes = new askmePro.views.Top20LikesView({
                collection: new askmePro.collections.UsersCollection()
            });
            this.views.likes.render();
            this.views.likes.load();
        }
    },
    followers: function followers() {
        $('#top20-tabs li a[href="#top20-followers"]').tab('show');
        if (typeof this.views.followers === 'undefined') {
            this.views.followers = new askmePro.views.Top20FollowersView({
                collection: new askmePro.collections.UsersCollection()
            });
            this.views.followers.render();
            this.views.followers.load();
        }
    }
});
$(function () {
    $('#top20-tabs li a').on('shown.bs.tab', function(e) {
        location.hash = '/' + $(e.target).attr('href').substr(7);
    });
});