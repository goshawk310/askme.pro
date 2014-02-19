$(function () {
    var barContainer = $('#admin-bar-container'),
        barButton = $('#btn-admin-bar'),
        contentWrapper = $('#admin-content-wrapper'),
        setHeight = function setHeight() {
            contentWrapper.height($('body').height() - $('#footer').outerHeight() - parseInt(contentWrapper.css('paddingTop'), 10)); 
        },
        form = $('.admin-form.default');
    if (contentWrapper.length) {    
        setHeight();
        $(window).on('resize', setHeight);
    } 
    if ($.cookie('admin-bar-container') === 'closed') {
        barContainer.addClass('closed');
    }    
    barButton.on('click', function () {
        if (barContainer.hasClass('closed')) {
            barContainer.removeClass('closed');
            $.cookie('admin-bar-container', '', {path: '/'});
        } else {
            barContainer.addClass('closed');
            $.cookie('admin-bar-container', 'closed', {path: '/'});
        }
    });
    if (form.length) {
        form.validate({
            submitHandler: function(form) {
                var $form = $(form),
                    submit = $form.find('button[type="submit"]');
                submit.attr('disabled', true);
                $.post($form.attr('action'), $form.serialize())
                .done(function (response) {
                    askmePro.utils.showAlert(response);
                })
                .fail(function () {
                    askmePro.utils.showAlert(response);
                })
                .always(function () {
                    submit.attr('disabled', false);
                });
            }
       });
    }
});