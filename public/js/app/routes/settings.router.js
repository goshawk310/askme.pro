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
        'bg': 'bg',
        'topbg': 'topbg',
        'points': 'points',
        'deactivate': 'deactivate'
    },
    index: function index() {
        $('#settings-tabs li a[href="#settings-index"]').tab('show');
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
        $('#settings-tabs li a[href="#settings-avatar"]').tab('show');
        if (typeof this.views.avatar === 'undefined') {
            this.views.avatar = new askmePro.views.SettingsAvatarView();
        }
    },
    password: function password() {
        $('#settings-tabs li a[href="#settings-passport"]').tab('show');
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
        $('#settings-tabs li a[href="#settings-profile"]').tab('show');
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
        $('#settings-tabs li a[href="#settings-bg"]').tab('show');
        if (typeof this.views.bg === 'undefined') {
            this.views.bg = new askmePro.views.SettingsBgView();
        }
    },
    topbg: function topbg() {
        $('#settings-tabs li a[href="#settings-topbg"]').tab('show');
        if (typeof this.views.topbg === 'undefined') {
            this.views.topbg = new askmePro.views.SettingsTopBgView();
        }
    },
    points: function points() {
        $('#settings-tabs li a[href="#settings-points"]').tab('show');
    },
    deactivate: function deactivate() {
        $('#settings-tabs li a[href="#settings-deactivate"]').tab('show');
    }
});

$(function () {
    $('#settings-tabs li a[data-toggle="pill"]').on('shown.bs.tab', function(e) {
        location.hash = '/' + $(e.target).attr('href').substr(10);
    });
});