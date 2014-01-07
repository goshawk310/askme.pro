'use strict';

var askmePro = {
    utils: {
        setupDefaultValidator: function setupDefaultValidator() {
            $.validator.setDefaults({
                debug: true,
                highlight: function(element, errorClass) {
                    $(element).parents('.form-group').addClass('has-error').removeClass('has-success');
                    $(element).parent().next().children('span').hide();
                },
                unhighlight: function(element, errorClass) {
                    $(element).parents('.form-group').removeClass('has-error').addClass('has-success');
                    $(element).parent().next().children('span').show();
                },
                errorElement: 'label',
                errorClass: 'help-block',
                errorPlacement: function(error, element) {
                    $(element).parent().next().append(error);
                }
            });
        }
    },
    index: function index() {
        var carousel = $('#fade-carousel'),
            elements = carousel.children('img'),
            elementLength = elements.length,
            i = 1;
        elements.first().show();
        setInterval(function() {
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