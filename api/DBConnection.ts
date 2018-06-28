const pgp = require('pg-promise')(/*options*/);

export class DBConnection {
    private db = pgp(process.env.POSTGRES_URI);

    public getAllCopies() {
        return this.db.any('SELECT * FROM copies');
    }

    // get user with given username
    // PRECONDITION: name is a sanitised string (no special symbols)
    // POSTCONDITION: if user with that username exists, then return user object, otherwise throw error
    public getUser(name: string) {
        return this.db.one(`SELECT * FROM users WHERE username='${name}'`);
    }

    public getBooksBorrowedBy(uid: number) {
        return this.db.any(
        `SELECT books.id AS "bookId", 
            books.title AS "title", 
            books.author AS "author", 
            books.ISBN AS "ISBN",
            copies.duedate AS "dueDate" 
        FROM copies INNER JOIN  books ON books.id = copies.book`)
    }
}