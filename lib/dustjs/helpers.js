'use strict';
var moment = require('moment'),
    path = require('path'),
    _ = require('underscore');
//.extname(file.originalFilename);
module.exports = function (server) {
    /**
     * [getLocaleTranslationKey description]
     * @param  {String} locale
     * @param  {Number} value
     * @return {Number}
     */
    var getLocaleTranslationKey = function getLocaleTranslationKey(locale, value) {
        var key = 0;
        if (value === 1) {
            return key;
        }
        switch (locale) {
            case 'pl':
                if (value > 1 && value < 5) {
                    key = 1;
                } else {
                    key = 2;
                }
                break;
            case 'en':
                if (value !== 1) {
                    key = 1;
                }
                break;    
        }
        return key;
    };
    return {
        init: function init(dust) {
           dust.helpers.__ = function __(chunk, context, bodies, params) {
                var i18n = server.get('i18n'),
                    params = params || {},
                    separator = params.sep || ',',
                    words = params.words ? dust.helpers.tap(params.words, chunk, context).split(separator) : [],
                    locale = params.locale || i18n.getLocale(),
                    escape = params.escape ? Boolean(params.escape) : false,
                    args = [{
                        phrase: params.phrase,
                        locale: locale
                    }].concat(words),
                    translation = i18n.__.apply(null, args);
                if (escape) {
                    translation = _.escape(translation);
                }    
                return chunk.write(translation);
            };

            dust.helpers.p__ = function p__(chunk, context, bodies, params) {
                var i18n = server.get('i18n'),
                    params = params || {},
                    separator = params.sep || ',',
                    words = params.words ? dust.helpers.tap(params.words, chunk, context).split(separator) : [],
                    value = params.value ? parseInt(dust.helpers.tap(params.value, chunk, context), 10) : 0,
                    locale = params.locale || i18n.getLocale(),
                    translation = '',
                    key = getLocaleTranslationKey(locale, value),
                    phrase = words[key] ? words[key] : words[0],
                    escape = params.escape ? Boolean(params.escape) : false,
                    args = [{
                        phrase: phrase,
                        locale: locale
                    }];
                    console.log(params)
                    console.log('value: ' + value);
                    console.log('key: ' + key);
                if (escape) {
                    translation = _.escape(translation);
                }     
                translation = i18n.__.apply(null, args);
                return chunk.write(translation);
            };

            dust.helpers.dateTime = function dateTime(chunk, context, bodies, params) {
                var i18n = server.get('i18n'),
                    output = null,
                    momentObj = null,
                    params = params || {},
                    momentObj = params.date ? moment(params.date) : moment(),
                    format = params.format ? params.format : null,
                    method = params.method ? params.method : null,
                    locale = params.locale || i18n.getLocale();
                momentObj.lang(locale);
                if (method !== null) {
                    output = momentObj[method]();
                } else {
                    output = momentObj.format(format);
                }
                return chunk.write(output);
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
                    defaultAvatar = '/images/default_avatar.png',
                    image = user.avatar ? ('/uploads/avatars/' + user.avatar) : defaultAvatar,
                    alt = user.username || 'askme.pro', 
                    cssClass = params.cssClass || 'box-shadow img-circle user-avatar',
                    cssId = params.cssId ? ' id="' + params.cssId + '"' : '',
                    size = params.size || '',
                    enlarge = params.enlarge || false,
                    ext = '',
                    wrapper = params.wrapper || false,
                    output = '',
                    originalSizeImage = image;
                if (user.avatar) {
                    ext = path.extname(image);
                    if (!ext || ext === '.') {
                        image = null;
                    } else {
                        image = image.replace(ext, '/' + size + ext);
                    }
                }
                if (!image) {
                    image = defaultAvatar;
                }
                output = '<img src="' + image + '" alt="' + alt + '" class="' + cssClass + '"' + cssId + '>';
                if (enlarge) {
                    output = '<a class="enlarge magnific" href="' + originalSizeImage + '">' + output + '</a>';
                }
                if (wrapper) {
                    output = '<div class="user-avatar-wrapper">' + output + '</div>';
                }
                return chunk.write(output);
            };

            dust.helpers.hasPrivilegesOf =  function hasPrivilegesOf(chunk, context, bodies, params) {
                var body = bodies.block,
                    skip = bodies['else'],
                    params = params || {},
                    user = params.user || null,
                    role = params.role || 'user',
                    roles = {
                        admin: ['admin', 'editor', 'user'],
                        moderator: ['moderator', 'editor', 'user'],
                        editor: ['editor', 'user'],
                        user: ['user']
                    };
                if (!user) {
                    return chunk;
                }    
                if (roles[user.role].indexOf(role) > -1) {
                    if(body) {
                        return chunk.render(bodies.block, context);
                    } else {
                        _console.log( "Missing body block in the if helper!" );
                        return chunk;
                    }
                }
                if(skip) {
                    return chunk.render(bodies['else'], context);
                }
                return chunk;
            };

            dust.helpers.str = function __(chunk, context, bodies, params) {
                var params = params || {},
                    separator = params.sep || ',',
                    method = params.method || null,
                    value = params.value ? dust.helpers.tap(params.value, chunk, context) : '',
                    args = params.args ? dust.helpers.tap(params.args, chunk, context).split(separator) : [];
                return chunk.write(String.prototype[method].apply(value, args));
            };

            dust.helpers.strReplace = function __(chunk, context, bodies, params) {
                var params = params || {},
                    search = params.search || '',
                    replace = params.replace || '',
                    value = params.value ? dust.helpers.tap(params.value, chunk, context) : '',
                    args = params.args ? dust.helpers.tap(params.args, chunk, context).split(separator) : [];
                return chunk.write(String.prototype.replace.call(value, new RegExp(search, 'gi'), replace));
            };

            dust.helpers.now = function now(chunk, context, bodies, params) {
                return chunk.write(Date.now());
            };
        }
    };
};