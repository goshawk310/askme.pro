askmePro.views.Top20PointsView = Backbone.View.extend({
    loader: null,
    pagination: null,
    initialize: function(options) {
    },
    render: function() {
        this.setElement($('#main-content-wrapper'));
        return this;
    },
    events: {
    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#top20-points'),
            label = body.data('label');
        this.loader = body.loading();
        this.loader('show');
        body.html('');
        this.collection.fetch({
            add: false,
            url: '/api/users/top20',
            data: {mode: 'points'},
            success: function (collection, response, options) {
                thisObj.loader('hide');
                if (!response.length) {
                    body.html(thisObj.$('#main-content-container').data('noresults'));
                    return;
                }
                var index = 1;
                collection.add(response);
                collection.each(function (user) {
                    user.attributes.index = index;
                    body.append(new askmePro.views.Top20UserView({
                        model: user,
                        modeLabel: label,
                        modeValue: parseInt(user.get('points'), 10),
                        viewKey: 'points'
                    }).render().$el);
                    index += 1;
                });
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});

askmePro.views.Top20LikesView = Backbone.View.extend({
    loader: null,
    pagination: null,
    initialize: function(options) {
    },
    render: function() {
        this.setElement($('#main-content-wrapper'));
        return this;
    },
    events: {

    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#top20-likes'),
            label = body.data('label');
        this.loader = body.loading();
        this.loader('show');
        body.html('');
        this.collection.fetch({
            add: false,
            url: '/api/users/top20',
            data: {mode: 'likes'},
            success: function (collection, response, options) {
                thisObj.loader('hide');
                if (!response.length) {
                    body.html(thisObj.$('#main-content-container').data('noresults'));
                    return;
                }
                var index = 1;
                collection.add(response);
                collection.each(function (user) {
                    user.attributes.index = index;
                    body.append((new askmePro.views.Top20UserView({
                        model: user,
                        modeLabel: label,
                        modeValue: parseInt(user.get('stats.likes'), 10),
                        viewKey: 'likes'
                    })).render().$el);
                    index += 1;
                });
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});

askmePro.views.Top20FollowersView = Backbone.View.extend({
    loader: null,
    pagination: null,
    initialize: function(options) {
    },
    render: function() {
        this.setElement($('#main-content-wrapper'));
        return this;
    },
    events: {

    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#top20-followers'),
            label = body.data('label');
        this.loader = body.loading();
        this.loader('show');
        body.html('');
        this.collection.fetch({
            add: false,
            url: '/api/users/top20',
            data: {mode: 'followers'},
            success: function (collection, response, options) {
                thisObj.loader('hide');
                if (!response.length) {
                    body.html(thisObj.$('#main-content-container').data('noresults'));
                    return;
                }
                var index = 1;
                collection.add(response);
                collection.each(function (user) {
                    user.attributes.index = index;
                    body.append((new askmePro.views.Top20UserView({
                        model: user,
                        modeLabel: label,
                        modeValue: parseInt(user.get('stats.followers'), 10),
                        viewKey: 'points'
                    })).render().$el);
                    index += 1;
                });
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});

askmePro.views.Top20UserView = Backbone.View.extend(_.extend({
    template: _.template($('#top20-user-tpl').html()),
    initialize: function(options) {
        this.modeLabel = options.modeLabel;
        this.modeValue = options.modeValue;
        this.viewKey = options.viewKey;
    },
    render: function() {
        var thisObj = this;
        this.setElement($(this.template({
            user: this.model.attributes,
            modeLabel: thisObj.modeLabel,
            modeValue: thisObj.modeValue
        })));
        return this;
    },
    events: {
        
    },
    postFollow: function () {
        this.resetViews();
    },
    postUnfollow: function () {
        this.resetViews();
    },
    resetViews: function () {
        if (typeof askmePro.routers.Top20 !== 'undefined') {
            var i = null;
            for (i in askmePro.router.views) {
                if (i !== this.viewKey) {
                    askmePro.router.views[i] = null;
                    delete askmePro.router.views[i];
                }
            }
        }
    }
}, askmePro.mixins.userFollow));