askmePro.views.QuestionView = Backbone.View.extend({
    template: _.template($('#question-tpl').html()),
    commentsFormInitialized: false,
    initialize: function () {
        
    },
    render: function () {
        this.setElement($(this.template({question: this.model.attributes})));
        
        return this;
    },
    events: {
        'click .like-button': 'like',
        'click .dislike-button': 'dislike',
        'click .btn-comments': 'comments'
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
                alert('error');
            }
        });    
    },
    comments: function comments(e) {
        var comments = new askmePro.views.QuestionCommentsView(),
            $this = $(e.target),
            commentsWrapeprElement = this.$('.comments-wrapper'),
            textarea = this.$('.comments-wrapper').find('textarea[name="comment[contents]"]');
        $this.blur();
        if (!commentsWrapeprElement.is(':visible')) {
            commentsWrapeprElement.show();
            textarea.focus();
            if (!this.commentsFormInitialized) {
                textarea.autosize();
                this.comment(this.$('.comment-form'));
                this.commentsFormInitialized = true;
            }
        } else {
            commentsWrapeprElement.hide();
        }
    },
    comment: function comment($form) {
        var thisObj = this;
        $form.validate({
            rules: {
                'comment[contents]': {
                    required: true
                }
            },
            submitHandler: function(form) {
                var comment = new askmePro.models.QuestionCommentModel({
                    contents: thisObj.$('textarea[name="comment[contents]"]').val(),
                    anonymous: Boolean(hisObj.$('input[name="comment[anonymous]"]:checked').val()) || false
                });
                return false;
                console.log(comment.attributes);
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
            collection;
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
    template: _.template($('#question-comments-tpl').html()),
    initialized: false,
    initialize: function () {
        
    },
    render: function () {
        this.setElement($(this.template()));
        return this;
    },
    events: {
        
    },
    load: function load() {
        
    }
});