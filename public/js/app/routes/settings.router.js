askmePro.routerIndex = 'Settings';
askmePro.routers.Settings = Backbone.Router.extend({
    history: {},
    views: {},
    routes: {
        '': 'index',
        'index': 'index',
        'avatar': 'avatar',
        'password': 'password',
        'profile': 'profile',
        'bg': 'bg'
    },
    index: function index() {
        if (typeof this.history.index !== 'undefined') {
            return;
        }
        this.history.index = true;
        $('#change-email').on('change', function (e) {
            var $this = $(this),
                emailElem = $('#email');
            if (emailElem.is(':disabled')) {
                emailElem.attr('disabled', false);
            } else {
                emailElem.attr('disabled', true);
                emailElem.parents('.form-group').find('.help-block').parent().find('span').show();
                emailElem.parents('.form-group').find('.help-block').parent().find('label').hide();
                emailElem.parents('.form-group').removeClass('has-error').removeClass('has-success');
            }
        });
        $('#index-form').validate({
            rules: {
                email: {
                    required: true,
                    email: true,
                    remote: '/account/check'
                },
                name: {
                    required: true,
                    rangelength: [2, 20]
                },
                lastname: {
                    required: false,
                    rangelength: [2, 20]
                }
            },
            submitHandler: function(form) {
                var $form = $(form),
                    submit = $form.find('button[type="submit"]'),
                    loader = submit.next();
                submit.attr('disabled', true);
                loader.show();
                $.post($form.attr('action'), $form.serialize())
                    .done(function (response) {
                        askmePro.utils.showAlert(response);
                    })
                    .fail(function (response) {
                        askmePro.utils.showAlert(response);
                    })
                    .always(function () {
                        submit.attr('disabled', false);
                        loader.hide();
                    });
            }
        });

    },
    avatar: function avatar() {
        if (typeof this.history.avatar !== 'undefined') {
            return;
        }
        this.history.avatar = true;
        askmePro.upload.image(
            $('#avatar-form'),
            $('#avatar-progress'),
            $('#user-avatar'),
            askmePro.settings.upload.avatar.url,
            '300x'
        );
    },
    password: function password() {
        if (typeof this.history.password !== 'undefined') {
            return;
        }
        this.history.password = true;
        $('#password-form').validate({
            rules: {
                old_password: {
                    required: true,
                    password: true
                },
                password2: {
                    required: true,
                    equalTo: '#password'
                },
                password: {
                    required: true,
                    password: true
                },
                password2: {
                    required: true,
                    equalTo: '#password'
                }
            },
            submitHandler: function(form) {
                var $form = $(form),
                    submit = $form.find('button[type="submit"]'),
                    loader = submit.next();
                submit.attr('disabled', true);
                loader.show();
                $.post($form.attr('action'), $form.serialize())
                    .done(function (response) {
                        askmePro.utils.showAlert(response);
                    })
                    .fail(function (response) {
                        askmePro.utils.showAlert(response);
                    })
                    .always(function () {
                        submit.attr('disabled', false);
                        loader.hide();
                        $form.find('input[type="password"]').val('');
                    });
            }
        });
    },
    profile: function profile() {
        if (typeof this.history.profile !== 'undefined') {
            return;
        }
        this.history.profile = true;
        $('#profile-website, #profile-fanpage').on('focus', function () {
            var $this = $(this);
            if (!$this.val().length) {
                setTimeout(function () {
                    $this.val($this.attr('placeholder'));
                }, 0);
            }
        }).on('blur', function () {
            var $this = $(this);
            if ($this.attr('placeholder') === $this.val()) {
                $this.val('');
            }
        });
        $('#blocked_words').charsLimiter(200, $('#words-count'));
        $('#profile-bio').charsLimiter(200, $('#bio-count'));
        $('#profile-form').validate({
            rules: {
                'profile[website]': {
                    url: true
                },
                'profile[fanpage]': {
                    url: true
                },
                'profile[location]': {
                    maxlength: 200
                },
                'profile[motto]': {
                    maxlength: 200
                },
                'profile[bio]': {
                    maxlength: 200
                },
                blocked_words: {
                    maxlength: 200
                }     
            },
            submitHandler: function(form) {
                var $form = $(form),
                    submit = $form.find('button[type="submit"]'),
                    loader = submit.next();
                submit.attr('disabled', true);
                loader.show();
                $.post($form.attr('action'), $form.serialize())
                    .done(function (response) {
                        askmePro.utils.showAlert(response);
                    })
                    .fail(function (response) {
                        askmePro.utils.showAlert(response);
                    })
                    .always(function () {
                        submit.attr('disabled', false);
                        loader.hide();
                        $form.find('input[type="password"]').val('');
                    });
            }
        });
    },
    bg: function bg() {
        if (typeof this.views.bg === 'undefined') {
            this.views.bg = new askmePro.views.SettingsBgView();
        }
    }
});

$(function () {
    $('#settings-tabs').tab();
        if (location.hash !== '') {
        $('#settings-tabs li a[href="#settings-' + location.hash.substr(2) + '"]').tab('show');
    }
    $('#settings-tabs li a[data-toggle="pill"]').on('shown.bs.tab', function(e) {
        location.hash = '/' + $(e.target).attr('href').substr(10);
    });
});