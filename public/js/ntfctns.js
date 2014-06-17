$(function () {
    if (askmePro.data.user.id !== null) {
        var ready = true,
            interval = setInterval(function () {
                if (!ready) {
                    return;
                }
                ready = false;
                $.ajax('/ntfctns')
                .done(function (response) {
                    askmePro.utils.updateCounter('notify-questions', 'questions', response.questions, function (count) {
                        $('.inbox-count').html(count);
                        $('.inbox-count-container').show();
                    });
                    askmePro.utils.title.update(response.questions, 'Nowe pytanie');
                    askmePro.utils.updateCounter('notify-feed', 'feed', response.feed);
                    askmePro.utils.updateCounter('notify-likes', 'likes', response.likes);
                    ready = true;
                })
                .fail(function () {
                    ready = true;
                });
            }, 15000);
            askmePro.utils.title.update(parseInt($('.inbox-count-container > .inbox-count').first().text(), 10), false);
    }
})
