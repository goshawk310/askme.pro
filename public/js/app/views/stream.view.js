askmePro.views.StreamView = Backbone.View.extend({
    template: _.template($('#activity-tpl').html()),
    firstAnsweredAt: null,
    lastAnsweredAt: null,
    interval: null,
    newestQuestions: [],
    newestLikes: [],
    newestComments: [],
    newestLoadedAt: null,
    page: 0,
    loader: null,
    lastLikeAt: null,
    firstLikeAt: null,
    lastCommentAt: null,
    firstCommentAt: null,
    index: 0,
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
            data: {lastAnsweredAt: thisObj.lastAnsweredAt, lastLikeAt: thisObj.lastLikeAt, lastCommentAt: thisObj.lastCommentAt, mode: askmePro.settings.stream.mode},
            success: function (response) {
                thisObj.index += 1;
                var firstBlock = null; 
                if (response.questions && response.questions.length) {
                    var block = null;
                    _.each(response.questions, function (question) {
                        thisObj.collection.add(question);
                        block = new askmePro.views.QuestionView({
                            model: thisObj.collection.last(),
                            parent: thisObj
                        }).render().$el;
                        block.addClass('q-page-' + thisObj.index);
                        if (firstBlock === null) {
                            firstBlock = block;
                        }
                        body.append(block);
                    });
                    thisObj.lastAnsweredAt = thisObj.collection.last().get('answered_at');
                    if (!thisObj.interval) {
                        thisObj.firstAnsweredAt = thisObj.collection.first().get('answered_at');
                        thisObj.setupInterval();
                    }
                } else {
                    body.html($(_.template($('#empty-stream-tpl').html())()));
                }
                if (response.hasMore === false) {
                    thisObj.page =  0;
                    moreContainer.hide();
                } else {
                    thisObj.page = response.hasMore;
                    moreContainer.show();
                }
                thisObj.loader('hide');
                if (askmePro.settings.stream.mode === 'friends') {
                    if (response.comments && response.comments.length) {
                        var commentsContainer = $('<div></div>');
                        thisObj.lastCommentAt = response.comments[response.comments.length - 1].created_at;
                        if (thisObj.firstCommentAt === null) {
                            thisObj.firstCommentAt = response.comments[0].created_at;
                        }
                        _.each(response.comments, function (row, i) {
                            commentsContainer.append(new askmePro.views.StreamCommentView({
                                model: new Backbone.Model(row),
                                parent: thisObj,
                                index: i,
                                count: response.comments.length
                            }).render().$el);
                        });
                        commentsContainer.append('<div class="clearfix"></div>');
                        if (firstBlock) {
                            firstBlock.after(commentsContainer);    
                        }
                    }
                }
                if (askmePro.settings.stream.mode === 'friends') {
                    if (response.likes && response.likes.length) {
                        var likesContainer = $('<div></div>');
                        thisObj.lastLikeAt = response.likes[response.likes.length - 1].created_at;
                        if (thisObj.firstLikeAt === null) {
                            thisObj.firstLikeAt = response.likes[0].created_at;
                        }
                        _.each(response.likes, function (row, i) {
                            likesContainer.append(new askmePro.views.StreamLikeView({
                                model: new Backbone.Model(row),
                                parent: thisObj,
                                index: i,
                                count: response.likes.length
                            }).render().$el);
                        });
                        likesContainer.append('<div class="clearfix"></div>');
                        if (firstBlock) {
                            firstBlock.after(likesContainer);    
                        }
                    }
                }
            },
            error: function () {
                thisObj.loader('hide');
            }
        });
    },
    more: function more() {
        this.load(this.page);
    },
    newest: function newest() {
        var thisObj = this,
            body = this.$('#answers-container'),
            block = null,
            firstBlock = null;
        _.each(thisObj.newestQuestions, function (question, i) {
            thisObj.collection.unshift(question);
            block = new askmePro.views.QuestionView({
                model: thisObj.collection.first(),
                parent: thisObj
            }).render().$el;
            body.prepend(block);
            if ((thisObj.newestQuestions.length > 1 && i === thisObj.newestQuestions.length - 2) ||
                i === thisObj.newestQuestions.length - 1) {
                firstBlock = block;
            }
        });
        if (firstBlock && thisObj.newestLikes.length) {
            var likesContainer = $('<div></div>');
            _.each(thisObj.newestLikes, function (row, i) {
                likesContainer.append(new askmePro.views.StreamLikeView({
                    model: new Backbone.Model(row),
                    parent: thisObj,
                    index: i,
                    count: thisObj.newestLikes.length
                }).render().$el);
            });
            likesContainer.append('<div class="clearfix"></div>');
            firstBlock.after(likesContainer);
        }
        if (firstBlock && thisObj.newestComments.length) {
            var commentsContainer = $('<div></div>');
            _.each(thisObj.newestComments, function (row, i) {
                commentsContainer.append(new askmePro.views.StreamCommentView({
                    model: new Backbone.Model(row),
                    parent: thisObj,
                    index: i,
                    count: thisObj.newestComments.length
                }).render().$el);
            });
            commentsContainer.append('<div class="clearfix"></div>');
            firstBlock.after(commentsContainer);
        }
        this.$('.btn-newest').hide();
        thisObj.newestQuestions = [];
        thisObj.newestComments = [];
        thisObj.newestLikes = [];
    },
    setupInterval: function setupInterval() {
        var thisObj = this,
            $document = $(document),
            loadNewest = function loadNewest() {
                thisObj.loader('show');
                thisObj.collection.sync('read', thisObj.collection, {
                    data: {firstAnsweredAt: thisObj.firstAnsweredAt, firstLikeAt: thisObj.firstLikeAt, lastCommentAt: thisObj.lastCommentAt, mode: askmePro.settings.stream.mode},
                    success: function (response) {
                        thisObj.index += 1;
                        if (response.questions.length) {
                            thisObj.firstAnsweredAt = response.questions[0].answered_at;
                            thisObj.newestQuestions = response.questions.reverse().concat(thisObj.newestQuestions);
                            thisObj.$('.btn-newest').show().children('strong').html(thisObj.newestQuestions.length);
                        }
                        if (response.likes.length) {
                            thisObj.newestLikes = response.likes;
                            thisObj.firstLikeAt = response.likes[0].created_at;
                        }
                        if (response.comments.length) {
                            thisObj.newestComments = response.comments;
                            thisObj.firstCommentAt = response.comments[0].created_at;
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

askmePro.views.StreamLikeView = Backbone.View.extend({
    template: _.template($('#stream-like-tpl').html()),
    initialize: function (options) {
        this.parent = options.parent;
        this.index = options.index;
        this.count = options.count;
    },
    events: {
        'click .btn-show-more': 'showMore'
    },
    render: function () {
        var thisObj = this;
        this.setElement($(this.template({data: this.model.attributes, pageIndex: thisObj.parent.index, index: thisObj.index, count: thisObj.count})));
        return this;
    },
    showMore: function () {
        $('.stream-likes-' + this.parent.index).show();
        this.$('.btn-show-more').remove();
    }
});

askmePro.views.StreamCommentView = Backbone.View.extend({
    template: _.template($('#stream-comment-tpl').html()),
    initialize: function (options) {
        this.parent = options.parent;
        this.index = options.index;
        this.count = options.count;
    },
    events: {
        'click .btn-show-more': 'showMore'
    },
    render: function () {
        var thisObj = this;
        this.setElement($(this.template({data: this.model.attributes, pageIndex: thisObj.parent.index, index: thisObj.index, count: thisObj.count})));
        return this;
    },
    showMore: function () {
        $('.stream-comments-' + this.parent.index).show();
        this.$('.btn-show-more').remove();
    }
});