var dirname = __dirname + '/..';
module.exports = {
    baseDir: dirname,
    avatar: {
        dir: dirname + '/uploads/avatars/',
        url: '/uploads/avatars/',
        sizes: ['300x', '100x100']
    },
    custom_background: {
        dir: dirname + '/uploads/backgrounds/',
        url: '/uploads/backgrounds/'
    },
    predefined_background: {
        dir: dirname + '/public/images/themes/',
        url: '/images/themes/'
    },
    locales: [{
        key: 'pl',
        name: 'Polski'
    }, {
        key: 'en',
        name: 'English'
    }]
};