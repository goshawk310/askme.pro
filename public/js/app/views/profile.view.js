askmePro.views.ProfileIndexView = Backbone.View.extend({
    template: $('#profile-index-tpl').length ? _.template($('#profile-index-tpl').html()) : null,
    el: '#question-form-wrapper',
    initialize: function () {
        this.render();
    },
    render: function () {
        this.$el.html($(this.template()));
        this.$('#question-contents').charsLimiter(200, $('#question-contents-count'));
        this.ask();
        return this;
    },
    events: {
        'click #question-form-message-container a': 'hideMessage'
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
                    .done(function (response) {
                        message.show();
                        if (response.status === 'success') {
                            success.show();
                        } else {
                            error.show();
                        }
                    })
                    .fail(function () {
                        error.show();
                    })
                    .always(function () {
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
    }
});
