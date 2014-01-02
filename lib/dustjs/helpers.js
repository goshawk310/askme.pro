'use strict';
var moment = require('moment');

module.exports = function (server) {

	return {
		init: function init(dust) {

			dust.helpers.__ = function __(chunk, context, bodies, params) {
		    	var params = params || {},
		    		separator = params.sep || ',',
		            words = params.words ? dust.helpers.tap(params.words, chunk, context).split(separator) : [],
		            locale =  params.locale || context.stack.head.getLocale(),
		            args = [{phrase: params.phrase, locale: locale}].concat(words),
		            translation = context.stack.head.__.apply(null, args);
			  return chunk.write(translation);
		    };

		    dust.helpers.dateTime = function dateTime(chunk, context, bodies, params) {
		  	    var params = params || {},
		  	    	date = params.date ? moment(params.date) : moment(),
		  	        format = params.format ? params.format : null;
		  	    return chunk.write(date.format(format));
		    };

		}
    };    
};