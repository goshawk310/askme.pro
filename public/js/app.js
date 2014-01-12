'use strict';

var askmePro = {
    views: {},
    models: {},
    collections: {},
    routerIndex: null,
    routers: {},
    settings: {
        upload: {}
    },
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
        }
    },
    index: function index() {
        var carousel = $('#fade-carousel'),
            elements = carousel.children('img'),
            elementLength = elements.length,
            i = 1;
        elements.first().show();
        setInterval(function () {
            $(elements).fadeOut();
            $(elements[i]).fadeIn();
            i += 1;
            if (i >= elementLength) {
                i = 0;
            }
        }, 4000);
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
    if (askmePro.routerIndex !== null) {
        askmePro.router = new askmePro.routers[askmePro.routerIndex]();
        Backbone.history.start();
    }
});

(function($) {
    $.fn.extend( {
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
        }
    });
})(jQuery);