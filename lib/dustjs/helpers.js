'use strict';
var moment = require('moment'),
    path = require('path');
//.extname(file.originalFilename);
module.exports = function(server) {
    return {
        init: function init(dust) {
            dust.helpers.__ = function __(chunk, context, bodies, params) {
                var params = params || {},
                    separator = params.sep || ',',
                    words = params.words ? dust.helpers.tap(params.words, chunk, context).split(separator) : [],
                    locale = params.locale || context.stack.head.getLocale(),
                    args = [{
                        phrase: params.phrase,
                        locale: locale
                    }].concat(words),
                    translation = context.stack.head.__.apply(null, args);
                return chunk.write(translation);
            };

            dust.helpers.dateTime = function dateTime(chunk, context, bodies, params) {
                var params = params || {},
                    date = params.date ? moment(params.date) : moment(),
                    format = params.format ? params.format : null;
                return chunk.write(date.format(format));
            };
            
            dust.helpers.message = function message(chunk, context, bodies, params) {
                var data = dust.helpers.tap(params.data, chunk, context),
                    alertClass = '',
                    dismissable = typeof params.dismissable !== 'undefined' ? Boolean(params.dismissable) : true,
                    message = null,
                    output = '';
                if (Object.prototype.toString.call(data) === '[object Array]' && data.length > 0) {
                    data = data[0];
                }    
                if (data.error) {
                    alertClass = 'danger';
                    message = data.error;
                } else if (data.success) {
                    alertClass = 'success';
                    message = data.success;
                } else if (data.warning) {
                    alertClass = 'warning';
                    message = data.warning;
                }  else if (data.info) {
                    alertClass = 'info';
                    message = data.info;
                }
                if (message !== null) { 
                    output = '<div class="alert alert-' + alertClass + ' alert-dismissable">';
                    if (dismissable) {
                        output += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
                    }
                    output += message + '</div>';
                    return chunk.write(output);
                }
                return chunk;
            };

            dust.helpers.userAvatar = function userAvatar(chunk, context, bodies, params) {
                var params = params || {},
                    user = params.user || {},
                    image = user.avatar ? ('/uploads/avatars/' + user.avatar) : '/images/default_avatar.png',
                    alt = user.username || 'askme.pro', 
                    cssClass = params.cssClass || 'img-circle user-avatar',
                    cssId = params.cssId ? ' id="' + params.cssId + '"' : '',
                    size = params.size || '',
                    ext = '';
                if (user.avatar) {
                    ext = path.extname(image);
                    image = image.replace(ext, '/' + size + ext);
                    console.log(image);
                }    
                return chunk.write('<img src="' + image + '" alt="' + alt + '" class="' + cssClass + '"' + cssId + '>');
            };
        }
    };
};