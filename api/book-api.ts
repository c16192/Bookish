import {Request, Response} from "express"

const pgp = require('pg-promise')(/*options*/)
const db = pgp(process.env.POSTGRES_URI)

export default class BookAPI {

    public static getAllBooks(req: Request, res: Response) {
        db.any('select * from Copies')
            .then(function (data) {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved all books in the library'
                    });
            })
            .catch(function (err) {
                res.status(404)
                    .json({
                        status: 'error',
                        error: err,
                        message: 'Failed to retrieve all books in the library'
                    });
            });
}
}