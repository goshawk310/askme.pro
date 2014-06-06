$(function () {
    if (askmePro.data.user.id !== null) {
        var ready = true,
            updateCounter = function updateCounter(id, key, count, callback) {
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
            },
            interval = setInterval(function () {
                if (!ready) {
                    return;
                }
                ready = false;
                $.ajax('/ntfctns')
                .done(function (response) {
                    updateCounter('notify-questions', 'questions', response.questions, function (count) {
                        $('.inbox-count').html(count);
                        $('.inbox-count-container').show();
                    });
                    askmePro.utils.title.update(response.questions, 'Nowe pytanie');
                    updateCounter('notify-feed', 'feed', response.feed);
                    updateCounter('notify-likes', 'likes', response.likes);
                    ready = true;
                })
                .fail(function () {
                    ready = true;
                });
            }, 15000);
            askmePro.utils.title.update(parseInt($('.inbox-count-container > .inbox-count').text(), 10), false);
    }
})
