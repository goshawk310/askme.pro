'use strict';
var gcm = require('node-gcm');


var PushGcm = function () {
    this.sender = new gcm.Sender('AIzaSyBgYYEWf_r64Y-0eFWvycMrGa0-Iq3tBhw');
    this.message = null;
};

PushGcm.prototype.createMessage = function createMessage() {
    this.message = new PushGcmMessage(this.sender);
    return this.message;
};

var PushGcmMessage = function (sender) {
    this.sender = sender;
    this.message = new gcm.Message({
        collapseKey: 'askmeProQuestion',
        delayWhileIdle: false,
        timeToLive: 30000,
        data: {
            msgcnt: 2
        }
    });
};

PushGcmMessage.prototype.setDataTitle = function setDataTitle(value) {
    this.message.addDataWithKeyValue('title', value);
    return this;
};

PushGcmMessage.prototype.setDataContent = function setDataContent(value) {
    this.message.addDataWithKeyValue('message', value);
    return this;
};

PushGcmMessage.prototype.addDataWithObject = function addDataWithObject(value) {
    this.message.addDataWithObject(value);
    return this;
};

PushGcmMessage.prototype.addDataWithKeyValue = function addDataWithKeyValue(key, value) {
    this.message.addDataWithKeyValue(key, value);
    return this;
};

PushGcmMessage.prototype.setIds = function setIds(value) {
    this.ids = value;
    return this;
};

PushGcmMessage.prototype.send = function send(callback) {
    if (typeof callback !== 'function') {
        callback = function (err, result) {
            console.log(result);
        };
    }
    this.sender.send(this.message, this.ids, 4, callback);
};

module.exports.gcm = new PushGcm();