askmePro.views.StreamView = Backbone.View.extend({
    template: _.template($('#activity-tpl').html()),
    firstAnsweredAt: null,
    lastAnsweredAt: null,
    interval: null,
    newestQuestions: [],
    newestLoadedAt: null,
    page: 0,
    loader: null,
    initialize: function () {
        
    },
    render: function () {
        this.setElement($(this.template()));
        this.loader = this.$('#answers-wrapper').loading();
        return this;
    },
    events: {
        'click .more': 'more',
        'click .btn-newest': 'newest'
    },
    load: function load() {
        var thisObj = this,
            body = this.$('#answers-container'),
            moreContainer = this.$('.more-container');
        this.loader('show');
        this.collection.url = '/api/stream';
        this.collection.sync('read', this.collection, {
            data: {lastAnsweredAt: thisObj.lastAnsweredAt, mode: askmePro.settings.stream.mode},
            success: function (response) {
                _.each(response.questions, function (question) {
                    thisObj.collection.add(question);
                    body.append(new askmePro.views.QuestionView({
                        model: thisObj.collection.last(),
                        parent: thisObj
                    }).render().$el);
                });
                thisObj.lastAnsweredAt = thisObj.collection.last().get('answered_at');
                if (response.hasMore === false) {
                    thisObj.page =  0;
                    moreContainer.hide();
                } else {
                    thisObj.page = response.hasMore;
                    moreContainer.show();
                }
                if (!thisObj.interval) {
                    thisObj.firstAnsweredAt = thisObj.collection.first().get('answered_at');
                    thisObj.setupInterval();
                }
                thisObj.loader('hide');
            }
        });
    },
    more: function more() {
        this.load(this.page);
    },
    newest: function newest() {
        var thisObj = this,
            body = this.$('#answers-container');
        _.each(thisObj.newestQuestions, function (question) {
            thisObj.collection.unshift(question);
            body.prepend(new askmePro.views.QuestionView({
                model: thisObj.collection.first(),
                parent: thisObj
            }).render().$el);
        });
        this.$('.btn-newest').hide();
        thisObj.newestQuestions = [];
    },
    setupInterval: function setupInterval() {
        var thisObj = this,
            $document = $(document),
            loadNewest = function loadNewest() {
                thisObj.loader('show');
                thisObj.collection.sync('read', thisObj.collection, {
                    data: {firstAnsweredAt: thisObj.firstAnsweredAt, mode: askmePro.settings.stream.mode},
                    success: function (response) {
                        if (response.questions.length) {
                            thisObj.firstAnsweredAt = response.questions[0].answered_at;
                            thisObj.newestQuestions = response.questions.reverse().concat(thisObj.newestQuestions);
                            thisObj.$('.btn-newest').show().children('strong').html(thisObj.newestQuestions.length);
                        }
                        thisObj.newestLoadedAt = (new Date()).getTime();  
                        thisObj.loader('hide');
                    }
                });
            },
            helperTimestamp = null;
        this.newestLoadedAt = (new Date()).getTime();
        this.interval = setInterval(loadNewest, askmePro.settings.stream.interval);
        $(window).on('scroll', function (e) {
            if ($document.scrollTop() === 0) {
                helperTimestamp = e.timeStamp;
                if (helperTimestamp - thisObj.newestLoadedAt > askmePro.settings.stream.topInterval) {
                    loadNewest();
                }
            }
        });
    },
    loadNewestAnswers: function loadNewestAnswers() {
        var thisObj = this,
            body = this.$('#answers-container');
        if (!thisObj.newestAnswers.length) {
            return;
        }
        _.each(thisObj.newestAnswers, function (question) {
            thisObj.collection.unshift(question);
            body.prepend(new askmePro.views.QuestionView({
                model: thisObj.collection.first(),
                parent: thisObj
            }).render().$el);
        });
    }
});