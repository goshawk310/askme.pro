var config = require('../config/app'),
    express = require('express');

module.exports = function (server, dirname) {
    var IMGR = require('imgr').IMGR,
        imgrAvatars = new IMGR({
            namespace: '/uploads/avatars',
            cache_dir: dirname + '/uploads/avatars',
            url_rewrite: '/:path/:file/:size.:ext',
            whitelist: config.avatar.sizes
        });
    imgrAvatars.serve(dirname + '/uploads/avatars').using(server);
    
    server.use('/uploads', express.static(dirname + '/uploads'));
    /*var imgr2 = new IMGR({
        namespace: '/uploads/bgs',
        cache_dir: dirname + '/uploads/bgs',
        url_rewrite: '/:path/:file-:size.:ext',
        whitelist: ['500x500', '100x100']
    }).serve(dirname + '/uploads/bgs').using(server);*/
};