'use strict';

var nodemailer = require("nodemailer");
var Email = function Email() {
    this.emailOptions = {
        from: 'sojuz84@gmail.com',
        to: null,
        subject: null,
        text: null,
        html: null
    };
};

Email.prototype = {
    send: function send(callback) {
        var transport = this.createTransport();
        transport.sendMail(this.emailOptions, function(err, response) {
            callback(err, callback);
            transport.close();
        });
    },
    createTransport: function createTransport() {
        var transport = nodemailer.createTransport('SMTP', {
            service: 'Gmail',
            auth: {
                user: 'sojuz84@gmail.com',
                pass: "samsung666"
            }
        });
        return transport;
    },
    setFrom: function setFrom(val) {
        this.emailOptions.from = val;
        return this;
    },
    getFrom: function getFrom() {
        return this.emailOptions.from;
    },
    setTo: function setTo(val) {
        this.emailOptions.to = val;
        return this;
    },
    getTo: function getTo() {
        return this.emailOptions.to;
    },
    setSubject: function setSubject(val) {
        this.emailOptions.subject = val;
        return this;
    },
    getSubject: function getSubject() {
        return this.emailOptions.subject;
    },
    setText: function setText(val) {
        this.emailOptions.text = val;
        return this;
    },
    getText: function getText() {
        return this.emailOptions.text;
    },
    setHtml: function setHtml(val) {
        this.emailOptions.html = val;
        return this;
    },
    getHtml: function getHtml() {
        return this.emailOptions.html;
    },
    setEmailOptions: function setEmailOptions(val) {
        this.emailOptions = val;
        return this;
    },
    getEmailOptions: function getEmailOptions() {
        return this.emailOptions;
    }
};

module.exports = Email;
