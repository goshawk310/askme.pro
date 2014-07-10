'use strict';

var askmePro = {
    views: {
        helpers: {
            userAvatar: function userAvatar(params) {
                var user = params.user || {},
                    image = user.avatar ? ('/uploads/avatars/' + user.avatar) : '/images/default_avatar.png',
                    alt = user.username || 'myask.co', 
                    href = user.username ? (' href="/' + user.username + '"'): '',
                    cssClass = params.cssClass || 'box-shadow img-circle user-avatar',
                    cssId = params.cssId ? ' id="' + params.cssId + '"' : '',
                    linkClass = params.linkClass || 'user-avatar-wrapper',
                    size = params.size || '',
                    ext = '',
                    link = typeof params.link !== 'undefined' ? params.link : true,
                    output = '';
                if (user.avatar) {
                    ext = '.' + image.split('.').pop();
                    image = image.replace(ext, '/' + size + ext);
                }
                output = '<img src="' + image + '" alt="' + alt + '" class="' + cssClass + '"' + cssId + '>';
                if (link) {
                    output = '<a'+ href + ' class="' + linkClass + '">' + output + '</a>';
                }
                return output;
            },
            nl2br: function nl2br(value) {
                return (value + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
            },
            parseUrls: function parseUrls(value, params) {
                var urlRegexp = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi,
                    ytRegExp = /.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
                    allowedLinksRegExp = /^((https?:\/\/)(www[.])?(myask.co|facebook.com)(.*))$/,
                    urlMatches = value.match(urlRegexp),
                    matches = null,
                    ytVideoHtmlTpl = '<div class="media-wrapper panel panel-link no-shadow">' +
                        '<div class="panel-body text-center no-border no-padding">' +
                        '<div class="video-container visible">' +
                        '<iframe width="640" height="360" src="" frameborder="0" allowfullscreen></iframe>' +
                        '</div></div></div>',    
                    replacedHtml = '',
                    defaults = {
                        links: true,
                        yt: 'video'
                    },
                    options = _.defaults(params || {}, defaults);
                if (urlMatches) {
                    _.each(urlMatches, function (url) {
                        if (options.yt) {
                            matches = url.match(ytRegExp);
                            if (matches && matches[2].length) {
                                if (options.yt === 'video') {
                                    replacedHtml = ytVideoHtmlTpl.replace('src=""', 'src="http://www.youtube.com/embed/' + matches[2].replace('<br>', '') + '?wmode=opaque"');
                                    value = value.replace(url, replacedHtml);
                                } else if (options.yt === 'link') {
                                    replacedHtml = '<a href="http://www.youtube.com/watch?v=' + matches[2].replace('<br>', '') + ' " target="_blank">http://www.youtube.com/watch?v=' + matches[2] + ' </a>';
                                    value = value.replace(url, replacedHtml);
                                }
                            }
                        }
                        if (options.links) {
                            matches = url.match(allowedLinksRegExp);
                            if (matches) {
                                if (matches[4] === 'myask.co') {
                                    value = value.replace(url, '<a href="' + url + '">' + url + '</a>');
                                } else {
                                    value = value.replace(url, '<a href="' + url + '" target="_blank">' + url + '</a>');
                                }
                            }
                        }
                    });
                }
                return value;
            },
            parseProfileTags: function parseProfileTags(value) {
                return value.replace(/(^|\W)@([a-z\d][\w\-_]*)/ig, '$1<a class="user-tag" href="/$2">@$2</a>');    
            },
            parseUsersText: function parseUsersText(value, params) {
                var helpers = askmePro.views.helpers
                    params = params || {};
                return helpers.parseProfileTags(helpers.parseUrls($('<div>' + helpers.nl2br($.trim(value)).replace(/\<br\>/g, '&lt;br&gt;') + '</div>').text(), params.url || null).replace(/&lt;br&gt;/g, '<br>'));
            }
        }
    },
    models: {},
    collections: {},
    routerIndex: null,
    routers: {},
    mixins: {},
    settings: {
        upload: {},
        stream: {
            interval: 60000,
            topInterval: 10000,
            mode: 'friends'
        }
    },
    data: {},
    utils: {
        alertEventsInitialized: false,
        setupDefaultValidator: function setupDefaultValidator() {
            $.validator.setDefaults({
                debug: false,
                highlight: function (element, errorClass) {
                    $(element).parents('.form-group').addClass('has-error').removeClass('has-success');
                    $(element).parents('.form-group').find('.help-block').parent().children('span').hide();
                },
                unhighlight: function (element, errorClass) {
                    $(element).parents('.form-group').removeClass('has-error').addClass('has-success');
                    $(element).parents('.form-group').find('.help-block').parent().children('span').show();
                },
                errorElement: 'label',
                errorClass: 'help-block',
                errorPlacement: function (error, element) {
                    $(element).parents('.form-group').find('.help-block').parent().append(error);
                }
            });
        },
        showAlert: function showAlert(data) {
            var cssClass = 'alert alert-dismissable fade in',
                alertElem = $('#ajax-alert'),
                interval = null;
            if (!this.alertEventsInitialized) {
                alertElem.children('.close').bind('click', function (e) {
                    $(this).parent().hide();
                });
                alertElem.bind('closed.bs.alert', function () {
                    alertElem.hide();
                });
                this.alertEventsInitialized = true;
            }    
            if (data.status === 'error') {
                cssClass += ' alert-danger';
            } else {
                cssClass += ' alert-' + data.status;
            }    
            alertElem.attr('class', cssClass);
            alertElem.children('span').html(data.message);
            alertElem.show();
            $('html, body').scrollTop(0);
            interval = setInterval(function () {
                alertElem.hide();
                clearInterval(interval);
                interval = null;
            }, 7000);
        },
        title: {
            titleInterval: null,
            title: document.title,
            unansweredQuestions: parseInt($('.inbox-count-container > .inbox-count').text(), 10),
            update: function update(count, message) {
                var i = 0,
                    thisObj = this;
                if (this.titleInterval !== null) {
                    clearInterval(this.titleInterval);
                }
                if (count > this.unansweredQuestions && message) {
                    this.titleInterval = setInterval(function () {
                        if (parseInt($('.inbox-count-container > .inbox-count').text(), 10) <= thisObj.unansweredQuestions) {
                            document.title = thisObj.title;
                            clearInterval(thisObj.titleInterval);
                            thisObj.titleInterval = null;
                            return;
                        }
                        if (i % 2 === 0) {
                            document.title = '(' + count + ') ' + thisObj.title;
                        } else {
                            document.title = message + ' - ' + thisObj.title;
                        }
                        i += 1;
                    }, 2000);
                } else if (count > 0) {
                    document.title = '(' + count + ') ' + thisObj.title;
                } else {
                    document.title = thisObj.title;
                }
            }
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
        updateCounter: function updateCounter(id, key, count, callback) {
            if (!count) {
                return;
            }
            var feedButton = $('#' + id),
                counter = feedButton.children('span');
            askmePro.notifications.top.views[key] = null;    
            if (!counter.length) {
                counter = $('<span class="badge badge-top bg-danger animated flash">' + count + '</span>');
                feedButton.append(counter);
            } else {
                counter.html(count);
            }
            if (typeof callback === 'function') {
                callback(count);
            }
        }
    },
    index: function index() {
        var carousel = $('#fade-carousel'),
            elements = carousel.children('img'),
            elementLength = elements.length,
            i = 1;
        elements.first().show();
        if (elementLength > 1) {
            setInterval(function () {
                $(elements).fadeOut();
                $(elements[i]).fadeIn();
                i += 1;
                if (i >= elementLength) {
                    i = 0;
                }
            }, 4000);
        }
    },
    signup: function signup() {
        this.utils.setupDefaultValidator();
        $('#signup-form').validate({
            rules: {
                username: {
                    required: true,
                    username: true,
                    remote: '/account/check'
                },
                email: {
                    required: true,
                    email: true,
                    remote: '/account/check'
                },
                password: {
                    required: true,
                    password: true
                },
                password2: {
                    required: true,
                    equalTo: '#password'
                },
                name: {
                    required: true,
                    rangelength: [2, 20]
                },
                lastname: {
                    required: false,
                    rangelength: [2, 20]
                },
                captcha: {
                    required: true
                },
                terms_accepted: {
                    required: true
                }
            },
            submitHandler: function(form) {
                form.submit();
            }
        });
        $('#captcha-image').on('click', function() {
            $(this).attr('src', '/captcha.jpg?' + (new Date()).getTime());
        });
    }
};
$(document).ready(function () {
    if (!('ontouchstart' in window) && (!window.DocumentTouch || !(document instanceof DocumentTouch))) {
        $('body').addClass('no-touch');
    }
    var inboxCount = parseInt($('.inbox-count-container > span').html(), 10);
    if (inboxCount > 0) {
        $('.inbox-count-container').show();
    }
    if (askmePro.routerIndex !== null) {
        Backbone.emulateHTTP = true;
        Backbone._sync = Backbone.sync;
        Backbone.sync = function(method, model, options, error){
           options.beforeSend = function(xhr){
               xhr.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-param']").attr('content'));
           };
           return Backbone._sync(method, model, options, error);
        };
        askmePro.router = new askmePro.routers[askmePro.routerIndex]();
        Backbone.history.start();
    }
    $('.q-submit').on('click', function () {
        $('.main-search-form').submit();
    });
    $('.main-search-form').on('submit', function (e) {
        if ($('.q').val().length < 3) {
            e.preventDefault();
        }
    });
    
    (function() {
        var $q = $('.q'),
            container = null,
            options = {
                html: true,
                trigger: 'manual',
                placement: 'bottom',
                content: '&nbsp;'
            },
            template = null,
            searching = false,
            timeout = null,
            lastQuery = null,
            activePopoverElem = null,
            init = function init(elem) {
                elem.popover(options);
                template = _.template($('#live-search-results-tpl').html());
                $('body').on('click', function (e) {
                    if (activePopoverElem && activePopoverElem.is(':visible') && !container.is(e.target) && container.has(e.target).length === 0) {
                        if (!activePopoverElem.is(e.target) && activePopoverElem.has(e.target).length === 0) {
                            elem.popover('hide');
                        }
                    }
                });
            };
           
        $('.q').on('keyup', function () {
            var $this = $(this),
                val = $this.val();
            if (searching || val === lastQuery) {
                return;
            }
            container = $this.parents('.main-search-form-elems');
            if ($this.val().length > 2) {
                searching = true;
                timeout = setTimeout(function () {
                    lastQuery = val;
                    $.get('/api/users/search', {
                        q: lastQuery, limit: 10
                    }).done(function(response) {
                        console.log($this.data('initialized'));
                        if (!$this.data('initialized')) {
                            init($this);
                            $this.data('initialized', true);
                        }
                        $this.popover('show');
                        activePopoverElem = container.find('.popover');
                        container.find('.popover-content').html(template({
                            elements: response.users,
                            total: response.total,
                            q: val
                        }));
                        searching = false;
                    }).fail(function () {
                        searching = false;
                        $this.popover('hide');
                    });
                    clearTimeout(timeout);
                }, 800);
            }
        });
    }());
    
});

(function($) {
    $.fn.extend({
        charsLimiter: function(limit, elem) {
            $(this).on("keyup focus", function() {
                setCount(this, elem);
            });
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
                elem.html( limit - chars );
            }
            setCount($(this)[0], elem);
        },
        loading: function loading() {
            var $this = this,
                containerCssClass = 'loading-container',
                cssClass = 'loading',
                loaderElem = $this.find('.' + cssClass);
            $this.data('hasloder', true).addClass(containerCssClass);
            if (!loaderElem.length) {
                loaderElem = $('<div class="' + cssClass + '"></div>');
                $this.append(loaderElem);
            }
            return function (action) {
                if (typeof action !== 'undefined') {
                    if (action === 'show') {
                        loaderElem.css({display: 'block', opacity: 1});
                    } else if (action === 'hide') {
                        loaderElem.css({display: '', opacity: 0});
                    }
                }
                return loaderElem;
            };
        }
    });
})(jQuery);