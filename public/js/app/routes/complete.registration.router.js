askmePro.routerIndex = 'CompleteRegistration';
askmePro.routers.CompleteRegistration = Backbone.Router.extend({
    routes: {
        '*path': 'index'
    },
    index: function index() {
        askmePro.utils.setupDefaultValidator();
        $('#signup-form').validate({
            debug: true,
            rules: {
                username: {
                    required: true,
                    username: true,
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
                console.log(form);
                form.submit();
                return false;
            }
        });
        $('#change-username').on('change', function () {
            if ($(this).is(':checked')) {
                $('#username').removeAttr('disabled');
            } else {
                $('#username').attr('disabled', true).parents('.form-group').removeClass('has-error');

            }
        });
    }
});
