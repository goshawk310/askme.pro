var dirname = __dirname + '/..';
module.exports = {
    baseDir: dirname,
    avatar: {
        dir: dirname + '/uploads/avatars/',
        url: '/uploads/avatars/',
        sizes: ['300x', '100x', '50x']
    },
    custom_background: {
        dir: dirname + '/uploads/backgrounds/',
        url: '/uploads/backgrounds/'
    },
    predefined_background: {
        dir: dirname + '/public/images/themes/',
        url: '/images/themes/'
    },
    topbg: {
        dir: dirname + '/uploads/tops/',
        url: '/uploads/tops/'
    },
    answer: {
        dir: dirname + '/uploads/answers/',
        url: '/uploads/answers/'
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
        'top20'
    ]
};