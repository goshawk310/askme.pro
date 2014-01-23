askmePro.views.QuestionView = Backbone.View.extend({
    template: _.template($('#question-tpl').html()),
    initialize: function () {
        
    },
    render: function () {
        this.setElement($(this.template({question: this.model.attributes})));
        return this;
    },
    events: {
        'click .like-button': 'like',
        'click .dislike-button': 'dislike'
    },
    like: function like(e) {
        var thisObj = this,
            $this = $(e.currentTarget),
            question = this.model,
            like = new askmePro.models.QuestionLikeModel();
        question.set('stats.likes', this.model.get('stats.likes') + 1);
        $this.blur().attr('disabled', true);
        like.save({
            question_id: question.get('_id'),
            to: question.get('to')
        }, {
            url: 'question/like',
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