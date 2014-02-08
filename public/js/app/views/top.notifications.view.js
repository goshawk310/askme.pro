$(function () {
    var activePopover = null,
        activePopoverElem = null,
        likesInitialized = false,
        questionsInitialized = false,
        views = {},
        initPoover = function (elem, id, onShown) {
            return elem.popover({
                container: '#main-navbar',
                html: true,
                placement: 'bottom',
                title: elem.data('title'),
                content: '<div id="top-notivications-' + id + '-wrapper"></div>',
                trigger: 'manual'
            }).on('show.bs.popover', function () {
                $('#main-navbar').data('container', id);
                $('#main-navbar').attr('data-container', id);
            }).on('shown.bs.popover', function () {
                activePopover = elem;
                activePopoverElem = $('#main-navbar .popover');
                onShown();
            });
        },
        hideActive = function (container) {
            if (activePopover !== null && activePopoverElem.is(':visible') && $('#main-navbar').data('container') !== container) {
                activePopover.trigger('click');
            }
        };
    askmePro.notifications = {
        top: {
            views: {}
        }  
    };
    $('#notify-likes').on('click', function () {
        var $this = $(this);
        hideActive('likes');
        if (!likesInitialized) {
            initPoover($this, 'likes', function () {
                if (typeof askmePro.notifications.top.views.likes === 'undefined') {
                    askmePro.notifications.top.views.likes = new askmePro.views.TopNotificationsLikesView();
                    askmePro.notifications.top.views.likes.load();
                } else {
                    askmePro.notifications.top.views.likes.setHtml();
                }
                $this.children('span').remove();
            });
            likesInitialized = true;
        }
        $this.popover('toggle');
    });
    $('#notify-questions').on('click', function () {
        var $this = $(this);
        hideActive('questions');
        if (!questionsInitialized) {
            initPoover($this, 'questions', function () {
                if (typeof askmePro.notifications.top.views.questions === 'undefined') {
                    askmePro.notifications.top.views.questions = new askmePro.views.TopNotificationsQuestionsView();
                    askmePro.notifications.top.views.questions.load();
                } else {
                    askmePro.notifications.top.views.questions.setHtml();
                }
            });
            questionsInitialized = true;
        }
        $this.popover('toggle');
    });
    $(window).on('resize', function () {
        var popover = $('#main-navbar').children('.popover');
        if (popover.length && activePopover !== null) {
            popover.css({left: (activePopover.offset().left - popover.width() / 2 + activePopover.width() / 2)+ 'px'});
        }
    });
    $('body').on('click', function (e) {
        if (activePopoverElem && activePopoverElem.is(':visible') && !activePopover.is(e.target) && activePopover.has(e.target).length === 0) {
            if (!activePopoverElem.is(e.target) && activePopoverElem.has(e.target).length === 0) {
                activePopover.trigger('click');
            }
        }
    });
});

askmePro.views.TopNotificationsLikesView = Backbone.View.extend({
    template: _.template($('#top-notifications-likes-tpl').html()),
    response: null,
    rendered: false,
    initialize: function(options) {
    },
    render: function () {
        this.setElement($(this.template({
            elements: this.response
        })));
        this.rendered = true;
        return this;
    },
    setHtml: function () {
        if (!this.rendered) {
            this.render();
        }
        $('#top-notivications-likes-wrapper').html(this.$el);
    },
    load: function load(callback) {
        var thisObj = this;
        if (this.response !== null) {
            return this.setHtml();
        }
        $.ajax('/api/notifications/likes/top')
        .done(function(response) {
            thisObj.response = response;
        })
        .always(function () {
            thisObj.setHtml();
        });
    }
});

askmePro.views.TopNotificationsQuestionsView = Backbone.View.extend({
    template: _.template($('#top-notifications-questions-tpl').html()),
    response: null,
    rendered: false,
    initialize: function(options) {
    },
    render: function () {
        this.setElement($(this.template({
            elements: this.response
        })));
        this.rendered = true;
        return this;
    },
    setHtml: function () {
        if (!this.rendered) {
            this.render();
        }
        $('#top-notivications-questions-wrapper').html(this.$el);
    },
    load: function load(callback) {
        var thisObj = this;
        if (this.response !== null) {
            return this.setHtml();
        }
        $.ajax('/api/notifications/questions/top')
        .done(function(response) {
            thisObj.response = response;
        })
        .always(function () {
            thisObj.setHtml();
        });
    }
});