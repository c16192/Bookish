import {Book, User, BookCopy, RawBookCopy, getBookCopy, getRawBookCopy} from "./DataTypes";

const pgp = require('pg-promise')(/*options*/);

export class DBConnection {
    private db = pgp(process.env.POSTGRES_URI);

    public addBook = (book: Book): Promise<void> => {
        return this.db.none(`INSERT INTO books VALUES ${JSON.stringify(book)}`);
    };

    public addCopy = (copy: BookCopy): Promise<void> => {
        return this.db.none(`INSERT INTO copies VALUES ${JSON.stringify(getRawBookCopy(copy))}`);
    };

    public getAllCopies = (): Promise<BookCopy[]> => {
        return this.db.any('SELECT * FROM copies')
            .then(copies => copies.map(copy => this.parseBookCopy(copy)))
            .then(Promise.all.bind(Promise));
    };

    // get user with given username
    // PRECONDITION: name is a sanitised string (no special symbols)
    // POSTCONDITION: if user with that username exists, then return user object, otherwise throw error
    public getUser = (name: string): Promise<User> => {
        return this.db.one(`SELECT * FROM users WHERE username='${name}'`);
    };

    public getUserById = (id: number): Promise<User> => {
        return this.db.one(`SELECT * FROM users WHERE id=${id}`);
    };

    public getAllBooks(): Promise<Book[]> {
        return this.db.any(`SELECT * FROM books ORDER BY title, author`);
    }

    private getBookById = (bookId: number): Promise<Book> => {
        return this.db.one(`SELECT * FROM books where id=${bookId}`);
    };

    // get all books with the given title (or matching titles)
    // PRECONDITION: title is a sanitised string, but it may contain joker characters (e.g. *)
    public searchBookByTitle = (title: string): Promise<Book[]> => {
        return this.db.any(`SELECT * FROM books WHERE title LIKE "${title}"`);
    };

    // get all books from the given author (or matching authors)
    // PRECONDITION: author is a sanitised string, but it may contain joker characters (e.g. *)
    public searchBookByAuthor = (title: string): Promise<Book[]> => {
        return this.db.any(`SELECT * FROM books WHERE title LIKE "${title}"`);
    };

    public getBooksBorrowedBy = (uid: number): Promise<BookCopy[]> => {
        return this.db.any(
            `SELECT books.id AS "bookId", 
                books.title AS "title", 
                books.author AS "author", 
                books.ISBN AS "ISBN",
                copies.duedate AS "dueDate" 
            FROM copies INNER JOIN  books ON books.id = copies.book
            WHERE copies.borrowerid = ${uid}`
        ).then(copies => this.parseBookCopiesByUser(copies, uid));
    };

    public getCopiesOfBook(bookId: number): Promise<BookCopy[]> {
        return this.db.any(`SELECT * FROM copies WHERE book = ${bookId}`)
            .then(copies => this.parseBookCopiesByBook(copies, bookId));
    };

    private parseBookCopiesByUser = (copies: RawBookCopy[], uid: number): Promise<BookCopy[]> =>  {
        return this.getUserById(uid)
            //.then(x => {console.log(this); return x;})
            .then(user => copies.map(copy => this.parseBookCopy(copy, null, user)))
            .then(promiseList => Promise.all(promiseList));
    };

    private parseBookCopiesByBook = (copies: RawBookCopy[], bookId: number): Promise<BookCopy[]> => {
        return this.getBookById(bookId)
            .then(book => copies.map(copy => this.parseBookCopy(copy, book, null)))
            .then(promiseList => Promise.all(promiseList));
    };

    private parseBookCopy = (copy: RawBookCopy, book: Book = null, user: User = null): Promise<BookCopy> => {
        //find book object
        let bookObj: Promise<Book> = Promise.resolve(book);
        if (book == null) {
            bookObj = this.getBookById(copy.book);
        }

        //find user object
        let userObj: Promise<User> = Promise.resolve(user);
        if ((user == null) && (copy.borrowerid != null)) {
            userObj = this.getUserById(copy.borrowerid);
        }

        return Promise.all([bookObj, userObj])
            .then(bookAndUser => {
                const book = bookAndUser[0];
                const user = bookAndUser[1];

                return getBookCopy(user, book, copy);
            });
    };
}