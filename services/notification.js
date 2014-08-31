'use strict';
var gcm = require('../lib/push').gcm,
    _ = require('underscore');

module.exports = _.defaults({
    isNotificationPossible: function isNotificationPossible(user, key) {
        return user.push_ids.gcm.length && user.settings[key];
    },
    question: function question(user, question) {
        var res = this.getRes();
        if (!this.isNotificationPossible(user, 'notify_question')) {
            return;
        }
        gcm.createMessage()
            .setIds(user.push_ids.gcm)
            .setDataTitle(res.__('Nowe pytanie!'))
            .setDataContent(question.contents)
            .addDataWithKeyValue('stats', JSON.stringify(user.stats))
            .addDataWithKeyValue('notifications', JSON.stringify(user.notifications))
            .send();
    }
}, require('../lib/service'));