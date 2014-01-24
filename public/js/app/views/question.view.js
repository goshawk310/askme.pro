askmePro.views.QuestionView = Backbone.View.extend({
    template: _.template($('#question-tpl').html()),
    commentsFormInitialized: false,
    commentsView: null,
    initialize: function () {
        this.collection = new askmePro.collections.QuestionCommentCollection();
    },
    render: function () {
        this.setElement($(this.template({question: this.model.attributes})));
        
        return this;
    },
    events: {
        'click .like-button': 'like',
        'click .dislike-button': 'dislike',
        'click .btn-comments': 'lastComments',
        'click .btn-prev': 'prevComments'
    },
    like: function like(e) {
        var thisObj = this,
            $this = $(e.currentTarget),
            question = this.model,
            like = new askmePro.models.QuestionLikeModel();
        question.set('stats.likes', this.model.get('stats.likes') + 1);
        $this.blur().attr('disabled', true);
        like.save({
            to: question.get('to')
        }, {
            url: 'question/' + question.get('_id') + '/like',
            success: function (model, xhr) {
                $this.attr('disabled', false).removeClass('like-button').addClass('dislike-button');
                thisObj.$('.likes-wrapper')
                    .addClass('visible')
                    .find('.likes').html(question.get('stats.likes'));
            },
            error: function () {

            }
        });
    },
    dislike: function dislike(e) {
        var thisObj = this,
            $this = $(e.currentTarget),
            question = this.model,
            like = new askmePro.models.QuestionLikeModel({_id: question.get('_id')});
        question.set('stats.likes', this.model.get('stats.likes') - 1);
        $this.blur().attr('disabled', true);
        like.destroy({
            url: 'question/' + question.get('_id') + '/like',
            success: function () {
                var likes = question.get('stats.likes');
                $this.attr('disabled', false).removeClass('dislike-button').addClass('like-button');
                if (likes) {
                    thisObj.$('.likes-wrapper')
                        .addClass('visible')
                        .find('.likes').html(question.get('stats.likes'));
                } else {
                    thisObj.$('.likes-wrapper').removeClass('visible');
                } 
            },
            error: function () {
            }
        });    
    },
    lastComments: function lastComments(e) {
        var thisObj = this,
            $this = $(e.target),
            commentsWrapeprElement = this.$('.comments-wrapper'),
            submitButton = this.$('.btn-comment');
        $this.blur();
        if (!commentsWrapeprElement.is(':visible')) {
            commentsWrapeprElement.show();
            if (!this.commentsFormInitialized) {
                this.commentsView = new askmePro.views.QuestionCommentsView();
                this.commentsView.setElement(this.$('.comments-container'));
                if (this.model.get('stats.comments')) {
                    submitButton.attr('disabled', true);
                    this.commentsView.loadParams.overall = this.model.get('stats.comments');
                    this.commentsView.load(this.model.get('_id'), function () {
                        thisObj.comment();
                        thisObj.commentsFormInitialized = true;
                        submitButton.attr('disabled', false);
                        if (thisObj.commentsView.loadParams.overall > thisObj.commentsView.collection.length) {
                            thisObj.$('.btn-prev').show();
                        }
                    });
                } else {
                    this.comment();
                    this.commentsFormInitialized = true;
                }
            }
        } else {
            commentsWrapeprElement.hide();
        }
    },
    prevComments: function prevComments(e) {
        var thisObj = this,
            $this = $(e.target);
        $this.blur();
        $this.attr('disabled', true);
        this.commentsView.loadParams.page += 1;
        this.commentsView.loadPrev(this.model.get('_id'), function (data) {
            var loadParams = thisObj.commentsView.loadParams;
            $this.attr('disabled', false);
            if (loadParams.overall <= (loadParams.page * loadParams.limit)) {
                $this.remove();
            }
        });
    },
    comment: function comment() {
        var thisObj = this,
            form = this.$('.comment-form'),
            textarea = this.$('.comments-wrapper').find('textarea[name="comment[contents]"]');
        textarea.focus();
        textarea.autosize();   
        form.validate({
            rules: {
                'comment[contents]': {
                    required: true
                }
            },
            submitHandler: function () {
                var comment = new askmePro.models.QuestionCommentModel();
                comment.save({
                    contents: textarea.val(),
                    anonymous: Boolean(thisObj.$('input[name="comment[anonymous]"]:checked').val()) || false
                }, {
                    url: 'question/' + thisObj.model.get('_id') + '/comment',
                    success: function (model, xhr) {
                        thisObj.commentsView.collection.push(xhr.comment);
                        thisObj.commentsView.add();
                        textarea.val('');
                    },
                    error: function () {

                    }
                });
            }
        });
    }
});

askmePro.views.QuestionLikesView = Backbone.View.extend({
    template: _.template($('#question-likes-modal-tpl').html()),
    initialized: false,
    initialize: function () {
        
    },
    render: function () {
        this.setElement($(this.template()));
        return this;
    },
    events: {
        
    },
    load: function load(id, router) {
        var body = this.$('.modal-body'),
            collection,
            loader = null;
        if (!this.initialized) {
            this.$el.on('hidden.bs.modal', function () {
                router.navigate('', {trigger: true});
            });
            this.initialized = true;
        }
        body.html('');
        loader = body.loading();
        loader.css({display: 'block', opacity: 1});
        this.$el.modal('show');
        collection = new askmePro.collections.QuestionLikeCollection();
        collection.url = '/question/' + id + '/likes';
        collection.fetch({
            success: function (collection, response, options) {
                loader.hide();
                collection.each(function (like) {
                    body.append(new askmePro.views.QuestionLikeView({
                        model: like,
                    }).render().$el);
                });
            },
            error: function () {
                loader.hide();
            }
        });
    }
});

askmePro.views.QuestionLikeView = Backbone.View.extend({
    template: _.template($('#question-like-tpl').html()),
    initialize: function () {
        
    },
    render: function () {
        this.setElement($(this.template({like: this.model.attributes})));
        return this;
    }
});

askmePro.views.QuestionCommentsView = Backbone.View.extend({
    loadParams: {
        page: 1,
        limit: 10,
        overall: 0,
        fvid: null,
    },
    initialize: function () {
        var thisObj = this;
        this.collection = new askmePro.collections.QuestionCommentCollection();
    },
    render: function () {
        var thisObj = this;
        this.collection.each(function (comment) {
            thisObj.$el.append((new askmePro.views.QuestionCommentView({model: comment})).render().$el);
        });
        return this;
    },
    events: {
        
    },
    load: function load(id, callback) {
        var thisObj = this,
            loader = this.$el.loading();
        loader.css({display: 'block', opacity: 1});
        this.collection.url = '/question/' + id + '/comments';
        this.collection.fetch({
            reset: true,
            data: thisObj.loadParams,
            success: function (collection, response) {
                loader.hide();
                thisObj.loadParams.fvid = response.comments[0]._id;
                thisObj.collection.set(response.comments, {silent: true});
                thisObj.render();
                callback();
            },
            error: function () {
                loader.hide();
            }
        });
    },
    loadPrev: function loadPrev(id, callback) {
        var thisObj = this,
            loader = this.$el.loading();
        loader.css({display: 'block', opacity: 1});
        this.collection.url = '/question/' + id + '/comments';
        this.collection.fetch({
            reset: true,
            data: thisObj.loadParams,
            success: function (collection, response) {
                loader.hide();
                thisObj.loadParams.fvid = response.comments[0]._id;
                for (var i = response.comments.length - 1; i > -1; i -= 1) {
                    thisObj.collection.unshift(response.comments[i]);
                    thisObj.$el.prepend((new askmePro.views.QuestionCommentView({model: thisObj.collection.at(0)})).render().$el);
                }
                callback();
            },
            error: function () {
                loader.hide();
            }
        });
    },
    add: function add() {
        this.$el.append((new askmePro.views.QuestionCommentView({model: this.collection.last()})).render().$el);
    }
});

askmePro.views.QuestionCommentView = Backbone.View.extend({
    template: _.template($('#question-comment-tpl').html()),
    initialize: function () {
        this.setElement($(this.template({comment: this.model.attributes})));
    },
    render: function () {
        return this;
    },
    events: {
    }
});