import {Book, User, BookCopy, RawBookCopy, getBookCopy, getRawBookCopy} from "./DataTypes";
import * as log4js from 'log4js';

const logger = log4js.getLogger();

const pgp = require('pg-promise')(/*options*/);

export class DBConnection {
    private db = pgp(process.env.POSTGRES_URI);

    public addBook = (book: Book): Promise<void> => {
        logger.debug("Adding book: "+JSON.stringify(book));
        return this.db.none(`INSERT INTO books VALUES ${JSON.stringify(book)}`);
    };

    public addCopy = (copy: BookCopy): Promise<void> => {
        logger.debug("Adding book copy: "+JSON.stringify(copy));

        const query = `INSERT INTO copies VALUES ${JSON.stringify(getRawBookCopy(copy))}`;
        logger.debug("Running query: "+query);

        return this.db.none(query);
    };

    public getAllCopies = (): Promise<BookCopy[]> => {
        logger.debug("Querying all copies in the library");

        const query = 'SELECT * FROM copies';
        logger.debug("Running query: "+query);

        return this.db.any(query)
            .then(copies => copies.map(copy => this.parseBookCopy(copy)))
            .then(Promise.all.bind(Promise));
    };

    // get user with given username
    // PRECONDITION: name is a sanitised string (no special symbols)
    // POSTCONDITION: if user with that username exists, then return user object, otherwise throw error
    public getUser = (name: string): Promise<User> => {
        logger.debug("Querying user with name: "+name);

        const query = `SELECT * FROM users WHERE username='${name}'`;
        logger.debug("Running query: "+query);

        return this.db.one(query);
    };

    public getUserById = (id: number): Promise<User> => {
        logger.debug("Querying user with id "+id);

        const query = `SELECT * FROM users WHERE id=${id}`;
        logger.debug("Running query: "+query);

        return this.db.one(query);
    };

    public getAllBooks(): Promise<Book[]> {
        logger.debug("Querying all book (types)");

        let query = `SELECT * FROM books ORDER BY title, author`;
        logger.debug("Running query: "+query);

        return this.db.any(query);
    }

    private getBookById = (bookId: number): Promise<Book> => {
        logger.debug("Querying book with id "+bookId);

        let query = `SELECT * FROM books where id=${bookId}`;
        logger.debug("Running query: "+query);

        return this.db.one(query);
    };

    // get all books with the given title (or matching titles)
    // PRECONDITION: title is a sanitised string, but it may contain joker characters (e.g. *)
    public searchBookByTitle = (title: string): Promise<Book[]> => {
        logger.debug("Querying book with title: "+title);

        let query = `SELECT * FROM books WHERE title LIKE "${title}"`;
        logger.debug("Running query: "+query);

        return this.db.any(query);
    };

    // get all books from the given author (or matching authors)
    // PRECONDITION: author is a sanitised string, but it may contain joker characters (e.g. *)
    public searchBookByAuthor = (author: string): Promise<Book[]> => {
        logger.debug("Querying book by author: "+author);

        let query = `SELECT * FROM books WHERE title LIKE "${author}"`;
        logger.debug("Running query: "+query);

        return this.db.any(query);
    };

    public getBooksBorrowedBy = (uid: number): Promise<BookCopy[]> => {
        logger.debug("Querying books borrowed by user with id "+uid);

        let query =
            `SELECT books.id AS "bookId", 
                books.title AS "title", 
                books.author AS "author", 
                books.ISBN AS "ISBN",
                copies.duedate AS "dueDate" 
            FROM copies INNER JOIN  books ON books.id = copies.book
            WHERE copies.borrowerid = ${uid}`;
        logger.debug("Running query: "+query);

        return this.db.any(query)
            .then(copies => this.parseBookCopiesByUser(copies, uid));
    };

    public getCopiesOfBook(bookId: number): Promise<BookCopy[]> {
        logger.debug("Querying all copies of book with id "+bookId);

        let query = `SELECT * FROM copies WHERE book = ${bookId}`;
        logger.debug("Running query: "+query);

        return this.db.any(query)
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
        logger.debug(`Parsing book copy: ${JSON.stringify(copy)}, ` +
            `where book=${JSON.stringify(book)} and user=${JSON.stringify(user)}`);

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
                logger.debug(`Queries returned book: ${JSON.stringify(book)} and user: ${JSON.stringify(user)}`);

                return getBookCopy(user, book, copy);
            });
    };
}