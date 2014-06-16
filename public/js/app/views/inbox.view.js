askmePro.views.InboxIndexView = Backbone.View.extend({
    template: _.template($('#inbox-question-pager-tpl').html()),
    ytWidget: null,
    ytWidgetWidth: null,
    questionOfTheDay: null,
    initialize: function () {
        this.setElement($('#questions-wrapper'));
    },
    render: function () {
        var thisObj = this,
            container = this.$('#questions-container > .questions');
        if (!this.collection.length) {
            var npqTpl = _.template($('#inbox-no-questions-tpl').html());
            container.html($(npqTpl()));
        } else {
            container.html('');
            this.collection.each(function (question) {
                container.append(new askmePro.views.InboxQuestionView({
                    model: question,
                    attributes: {
                        parent: thisObj
                    }
                }).render().$el);
            });
        }
        if (this.attributes.total > this.attributes.perPage) {
            this.$('.panel-footer').html($(this.template(this.attributes)));
        }
        if (this.questionOfTheDay === null) {    
            $.get('/api/questions/of-the-day')
            .done(function (response) {
                if (response) {
                    thisObj.questionOfTheDay = new askmePro.views.InboxQuestionOfTheDay({
                        model: new askmePro.models.QuestionModel(response),
                        attributes: {
                            parent: thisObj
                        }
                    });
                    thisObj.$('#questions-container > .question-of-the-day').html(thisObj.questionOfTheDay.render().$el);
                }
            });
        }
        return this;
    },
    events: {
    },
    initYt: function initYt (params) {
        var thisObj = this,
            tag,
            firstScriptTag,
            createUploadWidget = function createUploadWidget(params) {
                thisObj.ytWidget = new YT.UploadWidget('widget', {
                    width: thisObj.ytWidgetWidth,
                    events: {
                        'onUploadSuccess': params.onUploadSuccess,
                        'onProcessingComplete': params.onProcessingComplete
                    }
                });
            };
        if (this.ytWidget) {
            this.ytWidget.destroy();
            createUploadWidget(params);
            
        } else {
            tag = document.createElement('script'),
            firstScriptTag = document.getElementsByTagName('script')[0];
            tag.src = 'https://www.youtube.com/iframe_api';
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
                thisObj.ytWidgetWidth = thisObj.$('#yt-modal').find('.modal-body').width();
                createUploadWidget(params)
            }
        }
    }
});

askmePro.mixins.inboxQuestion = {
    template: _.template($('#inbox-question-tpl').html()),
    validationInitialized: false,
    shareOnFacebook: false,
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
        'click button.remove': 'removeQuestion',
        'click .btn.yt': 'record',
        'change .share-fb': 'handleFacebookShare'
    },
    showAnswerForm: function showAnswerForm() {
        var thisObj = this;
        this.attributes.parent.$('.buttons').hide();    
        this.$('.answer-form-wrapper').show();
        $(window).scrollTop(this.$('.question-container').offset().top - 60);
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
            counter = $('.inbox-count'),
            notifyCounter = $('#notify-questions > span');
        submitButton.attr('disabled', true);
        this.model.save({
            answer: answerText
        }, {
            patch: true,
            success: function (model, xhr) {
                var count = parseInt(counter.html(), 10) - 1;
                thisObj.attributes.parent.$('.buttons').show(); 
                counter.html(count);
                notifyCounter.html(count);
                if (count < 1) {
                    notifyCounter.remove();
                }
                thisObj.showMessage(xhr.message);
                askmePro.utils.title.update(count, false);
                if (thisObj.shareOnFacebook) {
                    FB.api('/me/feed', 'post', {
                        link: 'http://www.askme.pro/questions/' + model.get('_id'),
                    });
                }
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
            counter = $('.inbox-count'),
            notifyCounter = $('#notify-questions').find('span.badge');
        this.model.destroy({
            success: function (model, xhr) {
                var count = parseInt(counter.html(), 10) - 1;
                counter.html(count);
                notifyCounter.html(count);
                if (count < 1) {
                    notifyCounter.remove();
                }
                askmePro.utils.title.update(count, false);
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
    },
    record: function record() {
        var thisObj = this,
            modal = $('#yt-modal').modal('show');
        modal.off('shown.bs.modal').on('shown.bs.modal', function () {
            thisObj.attributes.parent.initYt({
                onUploadSuccess: function (event) {
                    thisObj.model.save({
                        yt_video: event.data.videoId
                    }, {
                        url: '/api/questions/' + thisObj.model.attributes._id + '/videos',
                        patch: true,
                        success: function (model, xhr) {
                            modal.modal('hide');
                            var iframe = $('<iframe />', {
                                src: '//www.youtube.com/embed/' + event.data.videoId,
                                frameborder: '0',
                                allowfullscreen: ''
                            }).attr({
                                width: 650,
                                height: 360
                            });
                            thisObj.$('.video-container').addClass('visible').html(iframe);
                        },
                        error: function (model, xhr) {
                        }
                    });
                },
                onProcessingComplete: function (event) {
                    
                }
            });
        });
    },
    handleFacebookShare: function handleFacebookShare() {
        var thisObj = this,
            val = this.$('.share-fb:checked').val();
        if (parseInt(val, 10) === 1) {
            FB.getLoginStatus(function(response) {
                if (response.status !== 'connected') {
                    FB.login(function(){
                        thisObj.shareOnFacebook = true;
                    }, {scope: 'publish_actions'});
                } else {
                    thisObj.shareOnFacebook = true;
                }
            });
        } else {
            thisObj.shareOnFacebook = false;
        }
    }
};

askmePro.views.InboxQuestionView = Backbone.View.extend(askmePro.mixins.inboxQuestion);

askmePro.views.InboxQuestionOfTheDay =  Backbone.View.extend(_.defaults({
    removeQuestion: function removeQuestion() {
        
    },
    showAnswerForm: function showAnswerForm() {
        var thisObj = this;
        this.attributes.parent.$('.buttons').hide();
        $.ajax('/api/questions/of-the-day', {
            method: 'post',
            beforeSend: function(xhr) {
               xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-param"]').attr('content'));
            }
        })
        .done(function (response) {
            thisObj.model.set(response);
            thisObj.model.urlRoot = '/api/questions'
            thisObj.$('.answer-form-wrapper').show();
            $(window).scrollTop(thisObj.$('.answer-form-wrapper').position().top);
            if (!thisObj.validationInitialized) {
                thisObj.$('form').validate({
                    rules: {
                        'question[answer]': {
                            required: true
                        }
                    },
                    submitHandler: function submitHandler(form, e) {
                        e.preventDefault();
                        thisObj.answer(form, e);
                    }
                });
                thisObj.validationInitialized = true;
            }
        });
        
    }
}, askmePro.mixins.inboxQuestion));
