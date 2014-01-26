askmePro.routerIndex = 'Inbox';
askmePro.routers.Inbox = Backbone.Router.extend({
    views: {},
    routes: {
        '(:page)': 'index'
    },
    index: function index(page) {
        var thisObj = this,
            perPage = 10,
            page = page || 0,
            loader = $('#questions-wrapper > .panel-body').loading();
        loader.css({display: 'block', opacity: 1});
        $.get('/inbox/questions?perPage=' + perPage + '&p=' + page)
            .done(function (response) {
                var collection = new askmePro.collections.QuestionCollection(response.questions);
                collection.url = '/api/questions'
                thisObj.views.index = new askmePro.views.InboxIndexView({
                    collection: collection,
                    attributes: {
                        page: page,
                        perPage: perPage,
                        total: response.total
                    }
                });
                thisObj.views.index.render();            
            })
            .fail(function () {

            })
            .always(function () {
                loader.hide();
            });
    }
});
