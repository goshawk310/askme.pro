askmePro.views.SettingsAvatarView = Backbone.View.extend({
    template: _.template($('#settings-avatar-tpl').html()),
    el: '#settings-avatar',
    initialize: function () {
        this.render();
    },
    render: function () {
        var thisObj = this;
        this.$el.html($(this.template()));
        this.$('.btn-info-popover').each(function () {
            var $this = $(this);
            $this.data('content', $this.next().html());
        });
        this.$('.btn-info-popover').popover({
            'html': true,
            'trigger': 'click',
            'container': 'body'
        });
        askmePro.upload.image(
            $('#avatar-form'),
            $('#avatar-progress'),
            $('#avatar-container'),
            askmePro.settings.upload.avatar.url,
            'cropped/300x'
        );
        return this;
    },
    events: {
        'click #avatar-remove': 'remove'
    },
    remove: function remove() {
        var thisObj = this,
            form = this.$('#avatar-form'),
            action = form.attr('action'); 
        $.post(action, form.serialize())
            .done(function (response) {
                askmePro.utils.showAlert(response);
                thisObj.$('#avatar-container').html(response.extra_message);
            }).fail(function (response) {
                askmePro.utils.showAlert(response);
            }).always(function () {

            });
    }
});

askmePro.views.SettingsBgView = Backbone.View.extend({
    template: _.template($('#settings-bg-tpl').html()),
    backgroundElement: _.template($('#settings-custom-bg-tpl').html()),
    el: '#settings-bg',
    initialize: function () {
        this.render();
    },
    render: function () {
        var thisObj = this;
        $.get('/account/settings/background').done(function (response) {
            thisObj.$el.html($(thisObj.template({bgs: response})));
            askmePro.upload.image($('#new-custom-bg-form'), $('#new-custom-bg-progress'), null,
                askmePro.settings.upload.background.url, null, function (e, data, formElem, progressElem, imgElem, path) {
                    var uploadObj = this,
                        container = thisObj.$('#bgs-container'),
                        userBgElement = container.find('.custom-background');
                    askmePro.utils.showAlert(data.result);
                    if (data.result.status === 'success' && data.result.filename) {
                        if (userBgElement.length) {
                            userBgElement.remove();
                        }
                        container.prepend($(thisObj.backgroundElement({bg: data.result.filename})));
                        container.find('.custom-bg').trigger('click');
                    }
                    uploadObj.hideProgress(progressElem);
                }
            );
        });
        return this;
    },
    events: {
        'click .bg-button': 'selectBg'
    },
    selectBg: function selectBg(e) {
        var $this = $(e.target),
            thisObj = this,
            buttons = $this.parents('#bgs-container').find('button'),
            bgImage = $this.css('background-image');
        if ($this.hasClass('active')) {
            return;
        }    
        $this.addClass('active');    
        buttons.attr('disabled', true);

        $('#wrapper').css({
            'background-image': bgImage
        }).addClass('custom-bg');

        $('#type').val($this.data('type'));
        $('#background').val($this.data('background'));
        $.ajax({
            url: '/account/settings/background',
            method: 'post',
            data: thisObj.$('#bg-form').serialize()
        }).done(function (response) {
            askmePro.utils.showAlert(response);
            buttons.removeClass('active');
            $this.addClass('active');
        }).always(function () {
             buttons.attr('disabled', false);
        });
    }
});

askmePro.views.SettingsTopBgView = Backbone.View.extend({
    template: _.template($('#settings-topbg-tpl').html()),
    el: '#settings-topbg',
    initialize: function () {
        this.render();
    },
    render: function () {
        var thisObj = this,
            upload = _.extend(askmePro.upload, {
                settings: {
                    acceptFileTypes: {
                        image: /(\.|\/)(jpe?g)$/i,
                    }
                }
            });
        this.$el.html($(this.template()));
        this.$('.btn-info-popover').each(function () {
            var $this = $(this);
            $this.data('content', $this.next().html());
        });
        this.$('.btn-info-popover').popover({
            'html': true,
            'trigger': 'click',
            'container': 'body'
        });
        upload.image(
            $('#top-bg-form'),
            $('#top-bg-progress'),
            $('#top-bg-container'),
            askmePro.settings.upload.topbg.url,
            null
        );
        return this;
    },
    events: {
        'click #top-bg-remove': 'remove'
    },
    remove: function remove() {
        var thisObj = this,
            form = this.$('#top-bg-form'),
            action = form.attr('action'); 
        $.post(action, form.serialize())
            .done(function (response) {
                askmePro.utils.showAlert(response);
                thisObj.$('#top-bg-container').html(response.extra_message);
            }).fail(function (response) {
                askmePro.utils.showAlert(response);
            }).always(function () {

            });
    }
});