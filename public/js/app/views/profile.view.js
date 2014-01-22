askmePro.views.ProfileIndexView = Backbone.View.extend({
    template: $('#profile-index-tpl').length ? _.template($('#profile-index-tpl').html()) : null,
    initialize: function() {
        this.render();
    },
    render: function() {
        this.setElement($(this.template()));
        if (this.$('#question-form').length) {
            this.$('#question-contents').charsLimiter(200, this.$('#question-contents-count'));
            this.ask();
        }
        this.setupPointsProgress();
        this.loadAnswers();
        return this;
    },
    events: {
        'click #question-form-message-container a': 'hideMessage',
        'click .more': 'more'
    },
    ask: function ask() {
        var form = this.$('#question-form'),
            message = this.$('#question-form-message-container'),
            success = message.children('.success'),
            error = message.children('.error');
        form.validate({
            rules: {
                'question[contents]': {
                    required: true
                }
            },
            submitHandler: function(form) {
                var $form = $(form),
                    submit = $form.find('button[type="submit"]');
                submit.attr('disabled', true);
                $.post($form.attr('action'), $form.serialize())
                    .done(function(response) {
                        message.show();
                        if (response.status === 'success') {
                            success.show();
                            error.hide();
                        } else {
                            error.show();
                            success.hide();
                        }
                    })
                    .fail(function() {
                        message.show();
                        success.hide();
                        error.show();
                    })
                    .always(function() {
                        submit.attr('disabled', false);
                    });
            }
        });

    },
    hideMessage: function hideMessage(e) {
        e.preventDefault();
        var message = this.$('#question-form-message-container');
        message.children('.message').hide();
        message.hide();
        this.$('#question-contents').val('');
        this.$('#question-contents-count').html(200);
    },
    setupPointsProgress: function setupPointsProgress() {
        var progressElem = $('#user-points-progress-bar'),
            points = parseInt(progressElem.attr('aria-valuenow'), 10),
            progress = 0,
            cssClass = 'levelone';
        if (points < 101) {
            progress = points;
        } else if (points > 100 && points < 501) {
            progress = (progress - 100) / 400 * 100;
            cssClass = 'leveltwo';
        } else if (points > 500 && points < 1001) {
            progress = (points - 500) / 500 * 100;
            cssClass = 'levelthree';
        } else if (points > 1000 && points < 5001) {
            progress = (points - 1000) / 4000 * 100;
            cssClass = 'levelfour';
        } else if (points > 5000) {
            progress = 100;
            cssClass = 'levelfive';
        }
        progressElem.addClass(cssClass).css('width', progress + '%');
    },
    loadAnswers: function loadAnswers(page) {
        var thisObj = this,
            loader = this.$('#answers-wrapper').loading(),
            container = this.$('#answers-container'),
            moreContainer = this.$('.more-container'),
            more = moreContainer.children('.more'),
            p = page || 0;
        loader.css({display: 'block', opacity: 1});
        $.get(window.location.pathname + '/answers?p=' + p)
            .done(function (response) {
                thisObj.collection = new askmePro.collections.QuestionCollection(response.questions);
                thisObj.collection.each(function (question) {
                    container.append(new askmePro.views.QuestionView({
                        model: question,
                        attributes: {
                            parent: thisObj
                        }
                    }).render().$el);
                });
                if (response.hasMore === false) {
                    more.data('page', 0);
                    moreContainer.hide();
                } else {
                    more.data('page', response.hasMore);
                    moreContainer.show();
                }
            })
            .fail(function () {

            })
            .always(function () {
                loader.hide();
            });

    },
    more: function more(e) {
        var $this = $(e.target);
        this.loadAnswers($this.data('page'));
    }
});


askmePro.views.ProfileInfoView = Backbone.View.extend({
    template: _.template($('#profile-info-tpl').html()),
    initialize: function() {
        this.render();
    },
    render: function() {
        this.setElement($(this.template()));
        return this;
    },
    events: {

    }
});
