'use strict';
var moment = require('moment');

module.exports = function(server) {

    return {
        init: function init(dust) {
            var csss = {},
                jss = {},
                jsScripts = [];
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

            dust.helpers.css = function css(chunk, context, bodies, params) {
                var file = '',
                    files = [];
                if (params === null) {
                    for (file in csss) {
                        files.push('<link type="text/css" href="' + file + '" rel="stylesheet" />');
                    }
                    return chunk.write(files.join('\n'));
                } else if (params.file && !css.hasOwnProperty(params.file)) {
                    csss[params.file] = params;
                }
                return chunk;
            };

            dust.helpers.js = function js(chunk, context, bodies, params) {
                var file = '',
                    files = [];
                if (params === null) {
                    for (file in jss) {
                        files.push('<script type="text/javascript" src="' + file + '"></script>');
                    }
                    return chunk.write(files.join('\n'));
                } else if (params.file && !css.hasOwnProperty(params.file)) {
                    jss[params.file] = params;
                }
                return chunk;
            };

            dust.helpers.jsScript = function jsScript(chunk, context, bodies, params) {
                var script = '',
                    scripts = [],
                    contents = '',
                    i = 0;
                if (!bodies.block) {
                    for (i = 0; i < jsScripts.length; i += 1) {
                        scripts.push(jsScripts[i]);
                    }
                    return chunk.write(scripts.join('\n'));
                } else if (bodies.block) {
                    chunk.tap(function(data) {
                        contents += data;
                        return "";
                    }).render(bodies.block, context).untap();
                    if (jsScripts.indexOf(contents) === -1) {
                        jsScripts.push(contents);
                    }
                }
                return chunk;
            };

            dust.helpers.message = function message(chunk, context, bodies, params) {
                var data = dust.helpers.tap(params.data, chunk, context),
                    alertClass = '',
                    dismissable = typeof params.dismissable !== 'undefined' ? Boolean(params.dismissable) : true,
                    message = null,
                    output = '';
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
        }
    };
};
