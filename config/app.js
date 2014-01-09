var dirname = __dirname + '/..';
module.exports = {
    avatar: {
        dir: dirname + '/uploads/avatars/',
        url: '/uploads/avatars/',
        sizes: ['300x', '100x100']
    },
    locales: [{
        key: 'pl',
        name: 'Polski'
    }, {
        key: 'en',
        name: 'English'
    }]
};