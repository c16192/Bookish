import {Request, Response} from "express"
import {DBConnection} from "./DBConnection";

export default class BookAPI {
    private dbConnection;

    constructor(db?: DBConnection) {
        if (db === undefined) {
            db = new DBConnection();
        }
        this.dbConnection = db;
    }

    public getAllBooks(req: Request, res: Response) {
        this.dbConnection.getAllCopies()
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