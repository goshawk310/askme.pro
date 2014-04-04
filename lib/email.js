'use strict';

var path           = require('path'),
    templatesDir   = path.resolve(__dirname, '..', 'email_templates'),
    emailTemplates = require('email-templates'),
    nodemailer = require('nodemailer');

var Email = function Email() {
    this.template = null;
    this.emailOptions = {
        from: 'no-reply@askme.pro',
        to: null,
        subject: null,
        text: null,
        html: null
    };
};

Email.prototype = {
    send: function send(callback) {
        var transport = this.createTransport();
        transport.sendMail(this.emailOptions, function(err, message) {
            transport.close();
            callback(err, message);
        });
    },
    setTemplate: function setTemplate(tmplFile, locals, callback) {
        var thisObj = this;
        emailTemplates(templatesDir, function (err, template) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            template(tmplFile, locals, function (err, html, text) {
                callback.call(thisObj, err, html, text);
            });
        });
    },
    createTransport: function createTransport() {
        var transport = nodemailer.createTransport('SMTP', {
            host: 'mail.askme.pro',
            auth: {
                user: 'no-reply@askme.pro',
                pass: 'b18ThkvB'
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
