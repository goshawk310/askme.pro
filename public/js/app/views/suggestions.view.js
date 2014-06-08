askmePro.settings.suggested = {
    users: []
};
askmePro.views.SuggesstionUsersView = Backbone.View.extend({
    user: null,
    initialize: function(options) {
    },
    events: {
        'click .btn-follow': 'follow'
    },
    render: function () {
        this.$el.removeClass('suggestions-loading');
        this.$el.find('.btn').removeClass('disabled');
        this.$el.find('.s-avatar').html(askmePro.views.helpers.userAvatar({
            user: this.user,
            size: 'cropped/100x',
            cssClass: 'avatar avatar-sm img-circle',
            link: false
        }));
        this.$el.find('.s-username').html(this.user.username);
        this.$el.find('.s-motto').html(this.user.profile.motto);
        this.$el.find('.btn-see-profile').attr('href', '/' + this.user.username);
        return this;
    },
    load: function load(callback) {
        var thisObj = this;
        $.ajax('/api/suggestions/users', {
            data: {
                limit: 1,
                excluded: askmePro.settings.suggested.users
            }
        })
        .done(function(response) {
            thisObj.user = response[0];
            askmePro.settings.suggested.users.push(thisObj.user._id);
            localStorage.removeItem('suggestions_users');
            localStorage.removeItem('suggestions_userscachettl');
            thisObj.render();
        });
    },
    follow: function (e) {
        e.preventDefault();
        var thisObj = this,
            $elem = $(e.currentTarget);
        $elem.addClass('disabled');
        $.ajax('/api/users/' + thisObj.user._id + '/follow', {
            type: 'post',
            beforeSend: function(xhr){
               xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-param"]').attr('content'));
            }
        }).done(function () {
            if (askmePro.settings.suggested.users.length < 8) {
                thisObj.load();    
            } else {
                thisObj.$el.remove();
            }
        }).always(function () {
            $elem.removeClass('disabled');
        });
        
    }
});

$(function () {
    var userElems = $('.suggestion-users-container'),
        views = [];
    if (userElems.length) {
        $.ajax('/api/suggestions/users', {
            localCache: true,
            cacheTTL : 180,
            cacheKey: 'suggestions_users',
            dataType: 'json',
            data: {
                limit: 2
            }
        })
        .done(function(response) {
            $.each(userElems, function (index, elem) {
                askmePro.settings.suggested.users.push(response[index]._id);
                var view = new askmePro.views.SuggesstionUsersView();
                view.setElement(elem);
                view.user = response[index];
                view.render();
            });
        });
    }
});