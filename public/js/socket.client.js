$(function () {
    if (askmePro.data.user.id !== null) {
        var socket = io.connect('http://localhost'),
            updateCounter = function updateCounter(id, key, callback) {
                var feedButton = $('#' + id),
                    counter = feedButton.children('span'),
                    count = 0;
                askmePro.notifications.top.views[key] = null;    
                if (!counter.length) {
                    count = 1;
                    counter = $('<span>' + count + '</span>');
                    feedButton.append(counter);
                } else {
                    count = parseInt(counter.html(), 10) + 1;
                    counter.html(count);
                }
                if (typeof callback === 'function') {
                    callback(count);
                }
            };
        socket.emit('hi', {id: askmePro.data.user.id});
        socket.on('feed', function (data) {
            updateCounter('notify-feed', 'feed');
        });
        socket.on('questions', function (data) {
            updateCounter('notify-questions', 'questions', function (count) {
                $('.inbox-count').html(count);
                $('#inbox-count').show();
            });
        });
        socket.on('likes', function (data) {
            updateCounter('notify-likes', 'likes');
        });
    }
})
