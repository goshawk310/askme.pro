askmePro.views.QuestionView = Backbone.View.extend({
    template: _.template($('#question-tpl').html()),
    commentsFormInitialized: false,
    commentsView: null,
    likesView: null,
    showAdd: false,
    initialize: function (options) {
        var thisObj = this;
        this.showAdd = options && options.showAdd ? true : false;
        this.collection = new askmePro.collections.QuestionCommentCollection();
        this.model.on('change:stats.comments', function (model, val) {
            thisObj.$('.btn-comments > span.count').html(val);
        });
    },
    render: function () {
        this.setElement($(this.template({question: this.model.attributes, showAdd: this.showAdd})));
        return this;
    },
    events: {
        'click .like-button': 'like',
        'click .dislike-button': 'dislike',
        'click .btn-comments': 'lastComments',
        'click .btn-prev': 'prevComments',
        'click .btn-likes': 'showLikes',
        'click .btn-remove': 'remove'
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
            url: '/api/questions/' + question.get('_id') + '/likes',
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
            url: '/api/questions/' + question.get('_id') + '/likes',
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
                this.commentsView.questionView = this;
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
        textarea.autosize();
        textarea.focus();
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
                    url: '/api/questions/' + thisObj.model.get('_id') + '/comments',
                    success: function (model, xhr) {
                        thisObj.commentsView.collection.push(xhr.comment);
                        thisObj.commentsView.add();
                        textarea.val('');
                        thisObj.model.set('stats.comments', thisObj.model.get('stats.comments') + 1);
                        
                    },
                    error: function () {
                        thisObj.$('textarea[name="comment[contents]"]')
                            .parent().removeClass('has-success').addClass('has-error');
                    }
                });
            }
        });
    },
    delegateAllEvents: function delegateAllEvents() {
        this.delegateEvents();
        this.comment();
        if (this.commentsView !== null) {
            _.each(this.commentsView.comments, function (commentView) {
                commentView.delegateEvents();
            });
        }
    },
    showLikes: function showLikes(e) {
        $(e.target).blur();
        if (this.likesView === null) {
            this.likesView = new askmePro.views.QuestionLikesView();
            $('body').append(this.likesView.render().$el);
        }
        this.likesView.load(this.model.get('_id'));
    },
    remove: function remove() {
        var thisObj = this,
            counter = $('.inbox-count');
        this.model.urlRoot = '/api/questions';
        this.model.destroy({
            success: function (model, xhr) {
                thisObj.showMessage(xhr.message, 'alert-info');
            },
            error: function (model, xhr) {
                thisObj.showErrorMessage(xhr.responseJSON.message);
            }
        });
    },
    showMessage: function showMessage(message, cls) {
        var interval = null,
            thisObj = this;
        this.$('.question-container')
            .html('<div class="col-md-12"><div class="alert ' + (cls || 'alert-success') + '">' + message + '</div></div>');
        interval = setTimeout(function () {
            thisObj.$el.slideUp(400, function () {
                thisObj.$el.remove();
                clearInterval(interval);
                interval = null;
            });
        }, 2000);    
    },
    showErrorMessage: function showErrorMessage(message) {
        var interval = null,
            thisObj = this;
        this.$el.prepend('<div class="col-md-12"><div class="alert alert-danger">' + message + '</div></div>');
        interval = setTimeout(function () {
            thisObj.$('.alert').remove();
            clearInterval(interval);
            interval = null;
        }, 2000);
    },
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
        if (typeof router !== 'undefined') {    
            if (!this.initialized) {
                this.$el.on('hidden.bs.modal', function () {
                    router.navigate('', {trigger: true});
                });
                this.initialized = true;
            }
        }
        body.html('');
        loader = body.loading();
        loader('show');
        this.$el.modal('show');
        collection = new askmePro.collections.QuestionLikeCollection();
        collection.url = '/api/questions/' + id + '/likes';
        collection.fetch({
            success: function (collection, response, options) {
                loader('hide');
                collection.each(function (like) {
                    body.append(new askmePro.views.QuestionLikeView({
                        model: like,
                    }).render().$el);
                });
            },
            error: function () {
                loader('hide');
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
    questionView: null,
    comments: {},
    initialize: function () {
        var thisObj = this;
        this.collection = new askmePro.collections.QuestionCommentCollection();
        this.collection.on('remove', function (model) {
            delete thisObj.comments[model.cid];
            thisObj.questionView.model.set('stats.comments', thisObj.questionView.model.get('stats.comments') - 1);
            thisObj.loadParams.overall = thisObj.questionView.model.get('stats.comments');
        });
        this.loadParams = {
            page: 1,
            limit: 10,
            overall: 0,
            fvid: null,
        };
    },
    render: function () {
        var thisObj = this;
        this.collection.each(function (comment) {
            thisObj.$el.append(thisObj.createCommentView(comment).render().$el);
        });
        return this;
    },
    createCommentView: function (model) {
        this.comments[model.cid] = new askmePro.views.QuestionCommentView({model: model});
        return this.comments[model.cid];
    },
    events: {
        
    },
    load: function load(id, callback) {
        var thisObj = this,
            loader = this.$el.loading();
        loader('show');
        this.collection.url = '/api/questions/' + id + '/comments';
        this.collection.fetch({
            reset: true,
            data: thisObj.loadParams,
            success: function (collection, response) {
                loader('hide');
                thisObj.loadParams.fvid = response.comments[0]._id;
                thisObj.collection.set(response.comments, {silent: true});
                thisObj.render();
                callback();
            },
            error: function () {
                loader('hide');
            }
        });
    },
    loadPrev: function loadPrev(id, callback) {
        var thisObj = this,
            loader = this.$el.loading();
        loader('show');
        this.collection.url = '/api/questions/' + id + '/comments';
        this.collection.fetch({
            reset: true,
            data: thisObj.loadParams,
            success: function (collection, response) {
                loader('hide');
                thisObj.loadParams.fvid = response.comments[0]._id;
                for (var i = response.comments.length - 1; i > -1; i -= 1) {
                    thisObj.collection.unshift(response.comments[i]);
                    thisObj.$el.prepend(thisObj.createCommentView(thisObj.collection.at(0)).render().$el);
                }
                callback();
            },
            error: function () {
                loader('hide');
            }
        });
    },
    add: function add() {
        this.$el.append(this.createCommentView(this.collection.last()).render().$el);
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
        'click .comment-remove': 'remove'
    },
    remove: function remove(e) {
        var thisObj = this,
            $this = $(e.target);
        $this.attr('disabled', true);    
        this.model.urlRoot = '/api/comments';
        this.model.destroy({
            success: function (model, response) {
                if (response.status === 'success') {
                    thisObj.$el.slideUp(400, function () {
                        thisObj.$el.remove();
                    });
                }
            },
            error: function () {
                
            }
        });
    }
});