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
            like = new askmePro.models.LikeModel();
        question.set('stats.likes', this.model.get('stats.likes') + 1);
        $this.blur().attr('disabled', true);
        like.save({
            question_id: question.get('_id'),
            to: question.get('to')
        }, {
            success: function (model, xhr) {
                $this.data('id', xhr.id).attr('disabled', false).removeClass('like-button').addClass('dislike-button');
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
            like = new askmePro.models.LikeModel({_id: $this.data('id')});
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
            }
        });    
    }
});