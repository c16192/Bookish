const pgp = require('pg-promise')(/*options*/);

export class DBConnection {
    private db = pgp(process.env.POSTGRES_URI);

    public getAllCopies() {
        return this.db.any('SELECT * FROM copies');
    }

    // get user with given username
    // PRECONDITION: name is a sanitised string (no special symbols)
    public getUser(name: string) {
        return this.db.any(`SELECT * FROM users WHERE name='${name}'`);
    }
}