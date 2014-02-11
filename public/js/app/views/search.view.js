askmePro.views.SearchView = Backbone.View.extend({
    loader: null,
    pagination: null,
    initialize: function(options) {
        this.limit = options.limit || 18;
    },
    render: function() {
        this.setElement($('#main-content-wrapper'));
        return this;
    },
    events: {

    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#main-content-container');
        this.loader = body.loading();
        this.loader('show');
        this.collection.fetch({
            add: false,
            url: '/api/users/search',
            data: {q: $('#q').val(), page: page || 0},
            success: function (collection, response, options) {
                thisObj.loader('hide');
                if (!response.total) {
                    body.html(body.data('noresults'));
                    return;
                }
                var html = '';
                collection.add(response.users);
                collection.each(function (user) {
                    html += new askmePro.views.SearchUserView({
                        model: user
                    }).render().$el.get(0).outerHTML;
                });
                body.html(html);
                if (parseInt(response.total, 10) > thisObj.limit) {
                    if (thisObj.pagination === null) {
                        thisObj.pagination = new askmePro.views.PaginationView({
                            total: response.total,
                            limit: thisObj.limit,
                            url: '#'
                        });
                        thisObj.$('#main-content-pagination-container').html(thisObj.pagination.render().$el);
                    }
                    thisObj.pagination.setPage(page);
                }
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    }
});

askmePro.views.SearchUserView = Backbone.View.extend({
    template: _.template($('#search-user-tpl').html()),
    initialize: function(options) {
    },
    render: function() {
        this.setElement($(this.template({user: this.model.attributes})));
        return this;
    },
    events: {
        
    }
});