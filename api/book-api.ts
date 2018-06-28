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

    public getAllBooks = (req: Request, res: Response) => {
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

    public getUserByUserName = (req: Request, res: Response) => {
        if ((!req.hasOwnProperty('query')) || (!req.query.hasOwnProperty('name'))) {
            res.status(200)
                .json({
                    status: 'error',
                    message: 'invalid request'
                });
        }
        this.dbConnection.getUser(escape(req.query.name))
            .then(function (data) {
                if (data.length == 0) {
                    res.status(200)
                        .json({
                            status: 'failure',
                            message: 'No such user'
                        });
                    return;
                }
                res.status(200)
                    .json({
                        status: 'success',
                        data: data[0],
                        message: 'Retrieved user with given name'
                    });
            })
            .catch(function (err) {
                res.status(404)
                    .json({
                        status: 'error',
                        error: err,
                        message: 'Failed to retrieve user -- internal error'
                    });
            });
    }
}