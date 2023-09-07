const { 
    addBooks,
    showBooks,
    detailedBook,
    updateBooks,
    deleteBooks,
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBooks,
    },
    {
        method: 'GET',
        path: '/books',
        handler: showBooks,

    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: detailedBook,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBooks,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBooks
    }
];

module.exports = routes;