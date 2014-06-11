var dirname = __dirname + '/..';
module.exports = {
    baseDir: dirname,
    avatar: {
        dir: dirname + '/uploads/avatars/',
        url: 'http://www.askme.pro/uploads/avatars/',
        sizes: ['300x', '100x', '50x']
    },
    custom_background: {
        dir: dirname + '/uploads/backgrounds/',
        url: 'http://www.askme.pro/uploads/backgrounds/'
    },
    predefined_background: {
        dir: dirname + '/public/images/themes/',
        url: 'http://www.askme.pro/images/themes/'
    },
    topbg: {
        dir: dirname + '/uploads/tops/',
        url: 'http://www.askme.pro/uploads/tops/'
    },
    answer: {
        dir: dirname + '/uploads/answers/',
        url: 'http://www.askme.pro/uploads/answers/'
    },
    sticker: {
        tmpDir: dirname + '/uploads/tmp/stickers/',
        tmpurl: '/tmp/stickers/',
        dir: dirname + '/public/images/stickers/',
        url: '/images/stickers/'
    },
    locales: [{
        key: 'pl',
        name: 'Polski'
    }, {
        key: 'en',
        name: 'English'
    }],
    reservedWords: [
        'uploads',
        'components',
        'css',
        'fonts',
        'images',
        'js',
        'templates',
        'inbox',
        'notifications',
        'search',
        'stream',
        'online',
        'top20',
        'api',
        'account'
    ]
};