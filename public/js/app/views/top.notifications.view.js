$(function () {
    var activePopover = null,
        activePopoverElem = null,
        likesInitialized = false,
        questionsInitialized = false,
        feedInitialized = false,
        initPoover = function (elem, id, onShown) {
            return elem.popover({
                container: '#main-navbar > .container',
                html: true,
                placement: 'bottom',
                title: elem.data('title') ? elem.data('title') : null,
                content: '<div id="top-notivications-' + id + '-wrapper"></div>',
                trigger: 'manual'
            }).on('show.bs.popover', function () {
                $('#main-navbar').data('container', id);
                $('#main-navbar').attr('data-container', id);
            }).on('shown.bs.popover', function () {
                activePopover = elem;
                activePopoverElem = $('#main-navbar .popover');
                $(window).trigger('resize');
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
            views: {
                likes: null,
                questions: null,
                feed: null
            }
        }  
    };
    $('#notify-likes').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        hideActive('likes');
        if (!likesInitialized) {
            initPoover($this, 'likes', function () {
                if (askmePro.notifications.top.views.likes === null) {
                    askmePro.notifications.top.views.likes = new askmePro.views.TopNotificationsLikesView();
                    askmePro.notifications.top.views.likes.load();
                } else {
                    askmePro.notifications.top.views.likes.setHtml();
                }
                $this.parent().children('span.badge').remove();
            });
            likesInitialized = true;
        }
        $this.popover('toggle');
    });
    $('#notify-questions').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        hideActive('questions');
        if (!questionsInitialized) {
            initPoover($this, 'questions', function () {
                if (askmePro.notifications.top.views.questions === null) {
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
    $('#notify-feed').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        hideActive('feed');
        if (!feedInitialized) {
            initPoover($this, 'feed', function () {
                if (askmePro.notifications.top.views.feed === null) {
                    askmePro.notifications.top.views.feed = new askmePro.views.TopNotificationsFeedView();
                    askmePro.notifications.top.views.feed.load();
                } else {
                    askmePro.notifications.top.views.feed.setHtml();
                }
                $this.parent().children('span.badge').remove();
            });
            feedInitialized = true;
        }
        $this.popover('toggle');
    });
    $(window).on('resize', function () {
        var popover = $('#main-navbar > .container').children('.popover'),
            arrow = null;
        if (popover.length && activePopover !== null) {
            popover.css({top: '40px'});
            arrow = popover.find('.arrow');
            arrow.css({left: (activePopover.position().left + activePopover.width() / 2  - arrow.width() / 2) + 'px'});
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

askmePro.views.TopNotificationsFeedView = Backbone.View.extend({
    template: _.template($('#top-notifications-feed-tpl').html()),
    response: null,
    rendered: false,
    initialize: function(options) {
    },
    render: function () {
        this.setElement($(this.template(this.response)));
        this.rendered = true;
        return this;
    },
    setHtml: function () {
        if (!this.rendered) {
            this.render();
        }
        $('#top-notivications-feed-wrapper').html(this.$el);
    },
    load: function load(callback) {
        var thisObj = this;
        if (this.response !== null) {
            return this.setHtml();
        }
        $.ajax('/api/notifications/feed/top')
        .done(function(response) {
            thisObj.response = response;
        })
        .always(function () {
            thisObj.setHtml();
        });
    }
});