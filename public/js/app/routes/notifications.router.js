askmePro.routerIndex = 'Notifications';
askmePro.routers.Notifications = Backbone.Router.extend({
    views: {},
    routes: {
        'answers': 'answers',
        'comments': 'comments',
        '*path': 'index'
    },
    index: function index() {
        $('#notifications-tabs li a[href="#notifications-likes"]').tab('show');
    },
    answers: function answers() {
        $('#notifications-tabs li a[href="#notifications-answers"]').tab('show');
    },
    comments: function comments() {
        $('#notifications-tabs li a[href="#notifications-comments"]').tab('show');
    }

});
$(function () {
    $('#notifications-tabs li a').on('shown.bs.tab', function(e) {
        location.hash = '/' + $(e.target).attr('href').substr(15);
    });
});