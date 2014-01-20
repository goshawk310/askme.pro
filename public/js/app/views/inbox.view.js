askmePro.views.InboxIndexView = Backbone.View.extend({
    template: _.template($('#inbox-question-pager-tpl').html()),
    initialize: function () {
        this.setElement($('#questions-wrapper'));
    },
    render: function () {
        var thisObj = this,
            container = this.$('#questions-container');
        container.html('');    
        this.collection.each(function (question) {
            container.append(new askmePro.views.InboxQuestionView({
                model: question,
                attributes: {
                    parent: thisObj
                }
            }).render().$el);
        });
        if (this.attributes.total > this.attributes.perPage) {
            this.$('.panel-footer').html($(this.template(this.attributes)));
        }
        return this;
    },
    events: {
    }
});

askmePro.views.InboxQuestionView = Backbone.View.extend({
    template: _.template($('#inbox-question-tpl').html()),
    validationInitialized: false,
    initialize: function () {
        
    },
    render: function () {
        var thisObj = this;
        this.setElement($(this.template({question: this.model.attributes})));
        askmePro.upload.image(
            thisObj.$('.answer-form'),
            thisObj.$('.progress'),
            thisObj.$('.image-container'),
            askmePro.settings.upload.answer.url,
            null, 
            function (e, data, formElem, progressElem, imgContainer, path) {
                var uploadObj = this,
                    filename = '';
                if (data.result.status === 'success' && data.result.filename) {
                    filename = path + data.result.filename;
                    imgContainer.html('<img src="' + filename + '"  class="img-thumbnail">');
                } else {
                    askmePro.utils.showAlert(data.result);
                }
                uploadObj.hideProgress(progressElem);
            }
        );
        return this;
    },
    events: {
        'click button.show-answer-form': 'showAnswerForm',
        'click button.cancel': 'cancel',
        'click button.remove': 'removeQuestion'
    },
    showAnswerForm: function showAnswerForm() {
        var thisObj = this;
        this.attributes.parent.$('.buttons').hide();    
        this.$('.answer-form-wrapper').show();
        $(window).scrollTop(this.$('.answer-form-wrapper').position().top);
        if (!this.validationInitialized) {
            this.$('form').validate({
                rules: {
                    'question[answer]': {
                        required: true
                    }
                },
                submitHandler: function submitHandler(form, e) {
                    thisObj.answer(form, e);
                }
            });
            this.validationInitialized = true;
        }
    },
    answer: function answer(form) {
        var thisObj = this,
            $form = $(form),
            answerText = $form.find('textarea[name="question[answer]"]').val(),
            submitButton = $form.find('button[type="submit"]'),
            counter = $('.inbox-count');
        submitButton.attr('disabled', true);
        this.model.save({
            answer: answerText
        }, {
            patch: true,
            success: function (model, xhr) {
                thisObj.attributes.parent.$('.buttons').show(); 
                counter.html(parseInt(counter.html(), 10) - 1);
                thisObj.showMessage(xhr.message);
            },
            error: function (model, xhr) {
                submitButton.attr('disabled', false);
                thisObj.showErrorMessage(xhr.responseJSON.message);
            }
        });
    },
    cancel: function cancel() {
        this.attributes.parent.$('.buttons').show();    
        this.$('.answer-form-wrapper').hide();
    },
    removeQuestion: function removeQuestion() {
        var thisObj = this,
            counter = $('.inbox-count');
        this.model.destroy({
            success: function (model, xhr) {
                counter.html(parseInt(counter.html(), 10) - 1);
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
                thisObj.remove();
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
    }
});
