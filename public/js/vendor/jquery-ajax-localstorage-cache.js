/**
 * Prefilter for caching ajax calls - adapted from
 * https://github.com/paulirish/jquery-ajax-localstorage-cache, made to work with jqXHR Deferred Promises.
 * See also $.ajaxTransport.
 * New parameters available on the ajax call:
 * localCache   : true,        // required if we want to use the cache functionality
 * cacheTTL     : 1,           // in seconds. Optional
 * cacheKey     : 'post',      // optional
 * isCacheValid : function  // optional - return true for valid, false for invalid
 * @method $.ajaxPrefilter
 * @param options {Object} Options for the ajax call, modified with ajax standard settings
 */
$.ajaxPrefilter(function(options){
    // Modernizr.localstorage, version 3 12/12/13
    function hasLocalStorage() {
        var mod = 'modernizr';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    }
    if (!hasLocalStorage() || !options.localCache) return;

    var cacheTtl = options.cacheTTL || 5;

    var cacheKey = options.cacheKey ||
        options.url.replace( /jQuery.*/,'' ) + options.type + options.data;

    // isCacheValid is a function to validate cache
    if ( options.isCacheValid && !options.isCacheValid() ){
        localStorage.removeItem( cacheKey );
    }
    // if there's a TTL that's expired, flush this item
    var ttl = localStorage.getItem(cacheKey + 'cachettl');
    if ( ttl && ttl < +new Date() ){
        localStorage.removeItem( cacheKey );
        localStorage.removeItem( cacheKey + 'cachettl' );
        ttl = 'expired';
    }

    var value = localStorage.getItem( cacheKey );
    if ( !value ){
        // If it not in the cache, we store the data, add success callback - normal callback will proceed
        if ( options.success ) {
            options.realsuccess = options.success;
        }
        options.success = function( data ) {
            var strdata = data;
            if ( this.dataType.indexOf( 'json' ) === 0 ) strdata = JSON.stringify( data );

            // Save the data to storage catching exceptions (possibly QUOTA_EXCEEDED_ERR)
            try {
                localStorage.setItem( cacheKey, strdata );
            } catch (e) {
                // Remove any incomplete data that may have been saved before the exception was caught
                localStorage.removeItem( cacheKey );
                localStorage.removeItem( cacheKey + 'cachettl' );
                console.log('Cache Error:'+e, cacheKey, strdata );
            }

            if ( options.realsuccess ) options.realsuccess( data );
        };

        // store timestamp
        if ( ! ttl || ttl === 'expired' ) {
            localStorage.setItem( cacheKey + 'cachettl', +new Date() + 1000 * cacheTtl );
        }
    }
});

/**
 * This function performs the fetch from cache portion of the functionality needed to cache ajax
 * calls and still fulfill the jqXHR Deferred Promise interface.
 * See also $.ajaxPrefilter
 * @method $.ajaxTransport
 * @params options {Object} Options for the ajax call, modified with ajax standard settings
 */
$.ajaxTransport("json", function(options){
    if (options.localCache) {
        var cacheKey = options.cacheKey ||
            options.url.replace(/jQuery.*/, '') + options.type + options.data;

        var value = localStorage.getItem(cacheKey);
        if (value){
            // In the cache? Get it, parse it to json, call the completeCallback with the fetched value.
            if (options.dataType.indexOf( 'json' ) === 0) value = JSON.parse(value);
            return {
                send: function(headers, completeCallback) {
                    completeCallback(200, 'success', {json:value})
                },
                abort: function() {
                    console.log("Aborted ajax transport for json cache.");
                }
            };
        }
    }
});