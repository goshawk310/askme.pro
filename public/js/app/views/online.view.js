askmePro.views.OnlineView = Backbone.View.extend({
    template: _.template($('#online-tpl').html()),
    userTemplate: _.template($('#online-user-tpl').html()),
    loader: null,
    pagination: null,
    limit: 200,
    initialize: function () {
        
    },
    render: function () {
        this.setElement($(this.template()));
        this.loader = this.$('#online-wrapper').loading();
        return this;
    },
    events: {
    },
    load: function load(page) {
        var thisObj = this;
        if (this.collection.length) {
            return this.show(page);
        }    
        this.loader('show');
        this.collection.url = '/api/users/online';
        this.collection.fetch({
            success: function () {
                thisObj.show(page);
                thisObj.loader('hide');
            }
        });
    },
    show: function show(page) {
        var thisObj = this,
            body = this.$('#online-container'),
            users = this.collection.slice(page * this.limit, page * this.limit + this.limit);
        body.html('');    
        _.each(users, function (user) {
            body.append($(thisObj.userTemplate({
                user: user.attributes
            })));
        });
        if (this.collection.length > this.limit && this.pagination === null) {
            this.pagination = new askmePro.views.PaginationView({
                total: this.collection.length,
                limit: thisObj.limit,
                url: '#'
            });
            this.$('#online-pagination-container').html(this.pagination.render().$el);
            this.pagination.setPage(page);
        }
    }
});