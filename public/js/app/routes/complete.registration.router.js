askmePro.routerIndex = 'CompleteRegistration';
askmePro.routers.CompleteRegistration = Backbone.Router.extend({
    routes: {
        '*path': 'index'
    },
    index: function index() {
        askmePro.utils.setupDefaultValidator();
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
                terms_accepted: {
                    required: true
                }
            },
            submitHandler: function(form) {
                form.submit();
            }
        });
        $('#change-username').on('change', function () {
            if ($(this).is(':checked')) {
                $('#username').removeAttr('disabled');
            } else {
                $('#username').attr('disabled', true);
                var usernameParent = $('#username').parents('.form-group');
                usernameParent.removeClass('has-error');
                usernameParent.find('label.help-block[for="username"]').html('');
                usernameParent.find('span.help-block:hidden').show();

            }
        });
        $('#change-email').on('change', function () {
            if ($(this).is(':checked')) {
                $('#email').removeAttr('disabled');
            } else {
                $('#email').attr('disabled', true);
                var emailParent = $('#email').parents('.form-group');
                emailParent.removeClass('has-error');
                emailParent.find('label.help-block[for="email"]').html('');
                emailParent.find('span.help-block:hidden').show();
            }
        });
    }
});
