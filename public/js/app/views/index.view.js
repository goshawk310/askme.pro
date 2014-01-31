askmePro.views.IndexActivityView = Backbone.View.extend({
    template: _.template($('#activity-tpl').html()),
    firstAnsweredAt: null,
    lastAnsweredAt: null,
    interval: null,
    newestQuestions: [],
    newestLoadedAt: null,
    page: 0,
    initialize: function () {
        
    },
    render: function () {
        this.setElement($(this.template()));
        return this;
    },
    events: {
        'click .more': 'more',
        'click .btn-newest': 'newest'
    },
    load: function load(page) {
        var thisObj = this,
            body = this.$('#answers-container'),
            moreContainer = this.$('.more-container'),
            p = page || 0;
        this.collection.url = '/api/activities';
        this.collection.fetch({
            add: false,
            data: {lastAnsweredAt: thisObj.lastAnsweredAt, p: p},
            success: function (collection, response, options) {
                collection.add(response.questions);
                thisObj.lastAnsweredAt = collection.last().get('answered_at');
                collection.each(function (question) {
                    body.append(new askmePro.views.QuestionView({
                        model: question,
                        parent: thisObj
                    }).render().$el);
                });
                if (response.hasMore === false) {
                    thisObj.page =  0;
                    moreContainer.hide();
                } else {
                    thisObj.page = response.hasMore;
                    moreContainer.show();
                }
                if (!thisObj.interval) {
                    thisObj.firstAnsweredAt = collection.first().get('answered_at');
                    thisObj.setupInterval();
                }
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
                thisObj.collection.fetch({
                    add: false,
                    data: {firstAnsweredAt: thisObj.firstAnsweredAt},
                    success: function (collection, response, options) {
                        if (response.questions.length) {
                            thisObj.firstAnsweredAt = response.questions[0].answered_at;
                            thisObj.newestQuestions = response.questions.reverse().concat(thisObj.newestQuestions);
                            thisObj.$('.btn-newest').show().children('strong').html(thisObj.newestQuestions.length);
                        }
                        thisObj.newestLoadedAt = (new Date()).getTime();  
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