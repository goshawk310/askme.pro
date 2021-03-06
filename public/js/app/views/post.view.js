askmePro.views.PostIndexView = Backbone.View.extend({
    template: _.template($('#post-modal-tpl').html()),
    modal: null,
    ytWidget: null,
    ytWidgetWidth: null,
    ytWidgetCreated: false,
    initialize: function () {
        var self = this;
        this.setElement($(this.template()));
        this.modal = this.$el.modal();
        this.modal.on('hide.bs.modal', function () {
            if (self.ytWidget !== null) {
                self.ytWidget.destroy();
                self.ytWidget = null;
                self.$('.video-container').hide();
            }
        });
    },
    events: {
        'click .btn.yt': 'record'
    },
    render: function () {
        var self = this;
        this.modal.modal('show');
        this.initImageUpload();
        this.$('.modal-body.main').removeClass('hidden');
        this.$('.modal-body.message').addClass('hidden');
        this.$('textarea[name="post[contents]"]').val('');
        this.$('textarea[name="post[contents]"]').parent().removeClass('has-error').removeClass('has-success');
        this.$('form').validate({
            rules: {
                'post[contents]': {
                    required: true
                }
            },
            submitHandler: function submitHandler(form, e) {
                self.add.call(self, form, e);
            }
        });
        return this;
    },
    add: function add(form) {
        var self = this,
            $form = $(form);
        $.ajax('/api/posts', {
            data: $form.serializeArray(),
            type: 'post'
        }).done(function (data) {
            if (data.status === 'success') {
                self.$('.modal-body.message').html('<p class="text-success">' + data.message + '</p>');
            } else {
                self.$('.modal-body.message').html('<p class="text-danger">' + data.message + '</p>');
            }
        }).fail(function () {

        }).always(function () {
            self.$('.modal-body.main').addClass('hidden');
            self.$('.modal-body.message').removeClass('hidden');
            var t = setTimeout(function () {
                self.modal.modal('hide');
                clearTimeout(t);
                t = null;
            }, 1000);
        });  
    },
    initImageUpload: function initImageUpload() {
        askmePro.upload.image(
            this.$('.post-form'),
            this.$('.progress'),
            this.$('.image-container'),
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
    },
    initYt: function initYt (params) {
        var self = this,
            tag,
            firstScriptTag,
            createUploadWidget = function createUploadWidget(params) {
                self.ytWidget = new YT.UploadWidget('yt-video-widget', {
                    width: self.ytWidgetWidth,
                    events: {
                        onUploadSuccess: params.onUploadSuccess,
                        onProcessingComplete: params.onProcessingComplete
                    }
                });
                var top = 30 + self.$('.modal-content').outerHeight() - self.$('.video-container').outerHeight(),
                    left = self.$('.modal-content').offset().left + (self.$('.modal-content').outerWidth() / 2 - 200);
                $('#yt-video-widget-container').css({
                    position: 'fixed',
                    left: left + 'px',
                    top: top + 'px',
                    zIndex: 9999
                });
            };
        if (this.ytWidget) {
            this.ytWidget.destroy();
            createUploadWidget(params);
        } else if (this.ytWidgetCreated) {
            createUploadWidget(params);
        } else {
            tag = document.createElement('script'),
            firstScriptTag = document.getElementsByTagName('script')[0];
            tag.src = 'https://www.youtube.com/iframe_api';
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
                self.ytWidgetWidth = 400;
                createUploadWidget(params)
            }
            this.ytWidgetCreated = true;
        }
    },
    record: function record() {
        var self = this,
            videoContainer = this.$('.video-container');
        if (videoContainer.is(':visible')) {
            videoContainer.hide();
            this.ytWidget.destroy();
            this.ytWidget = null;
            return;
        } else {
            videoContainer.show();  
            this.initYt({
                onUploadSuccess: function (event) {
                    $.ajax('/api/posts/video', {
                        data: {
                            yt_video: event.data.videoId
                        },
                        type: 'post',
                        beforeSend: function(xhr) {
                           xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-param"]').attr('content'));
                        }
                    }).done(function () {
                          var iframe = $('<iframe />', {
                            src: '//www.youtube.com/embed/' + event.data.videoId,
                            frameborder: '0',
                            allowfullscreen: ''
                        }).attr({
                            width: 650,
                            height: 360
                        });
                        self.$('#post-video-player').addClass('visible').html(iframe);  
                    }).fail(function () {

                    }).always(function () {
                    
                    });
                },
                onProcessingComplete: function (event) {
                    
                }
            });  
        }
    }
});