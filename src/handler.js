const { nanoid } = require('nanoid');
const books = require('./books');

// K3
const addBooks = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
      } = request.payload;

    const id = nanoid(32);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;

    // Gagal karena tidak menginputkan nama Buku
    if (name === null || name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }
    // Gagal karena readPage dan pageCount tidak seimbang
    if(readPage > pageCount ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400);
        return response;
    }

    if (pageCount === readPage){
        finished = true;
    }
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };
    // Push
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id).length > 0;
    // Check Push
    if(!isSuccess) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku!',
        });
        response.code(500);
        return response;
    }

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    });

    response.code(201);
    return response;

    
};

// K4
const showBooks = (request, h) => {
    const {name, reading, finished} = request.query; //Menggunakan req query karena mengambil param berisi value
    let filterBooks = books;

    // Query parameter
    if (name !== undefined) {
        const query = name.toLowerCase();
        filterBooks = books.filter((book) => book.name.toLowerCase().includes(query));
    } else if (reading === '1') {
        filterBooks = books.filter((book) => book.reading === true);
    } else if (reading === '0') {
        filterBooks = books.filter((book) => book.reading === false);
    } else if (finished === '1') {
        filterBooks = books.filter((book) => book.finished === true);
    } else if (finished === '0') {
        filterBooks = books.filter((book) => book.finished === false);
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filterBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
        },
    });

    response.code(200);
    return response;
};

// K5
// menapilkan buku secara detail menggunakan bookId
const detailedBook = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((n) => n.id === bookId)[0];

    if(book === null || book === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    const response = h.response ({
        status: 'success',
        data: {book},
    });
    response.code(200);
    return response;
};

// K6
const updateBooks = (request, h) => {
    const {bookId} = request.params;

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if(name === null || name === undefined){
        const response = h.response ({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    };

    const response = h.response ({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;

};
// K7
const deleteBooks = (request, h) => {
    const {bookId} = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1){
        const response = h.response ({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    books.splice(index, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
};


module.exports = {
    addBooks,
    showBooks,
    detailedBook,
    updateBooks,
    deleteBooks
}

