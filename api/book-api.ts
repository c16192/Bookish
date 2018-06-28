import {Request, Response} from "express"
import {DBConnection} from "./DBConnection";
import {Book} from "./DataTypes";

type statusMessage = "success" | "failure" | "error";
interface LookupResult {
    status: statusMessage,
    data?: any,
    err?: any,
    message: string
}

function getStatusCode(status: statusMessage) {
    if (status === "success") {
        return 200;
    }
    return 404;
}

function checkRequestForProperties(req: Request, res: Response, properties: string[]) {
    if ((!req.hasOwnProperty('query'))) {
        res.status(404)
            .json({
                status: 'error',
                message: 'invalid request'
            });
        return false;
    }

    for (let prop of properties) {
        if (!req.query.hasOwnProperty(prop)) {
            res.status(404)
                .json({
                    status: 'error',
                    message: `property "${prop}" is required`
                })
            return false;
        }
    }

    return true;
}

export default class BookAPI {
    private dbConnection;

    constructor(db?: DBConnection) {
        if (db === undefined) {
            db = new DBConnection();
        }
        this.dbConnection = db;
    }

    public static handleLookupResult(result: Promise<any>, successMsg: string, errorMsg: string): Promise<LookupResult> {
        return result
            .then(data => {
                return {
                    status: ("success" as statusMessage),
                    data: data,
                    message: successMsg
                };
            })
            .catch(err => {
                return {
                    status: ("error" as statusMessage),
                    err: err,
                    message: errorMsg
                };
            });
    }

    public static respondToRequest(res: Response, result: LookupResult) {
        res.status(getStatusCode(result.status))
            .json(result);
    }

    public static respondWithLookupResult(response: Response, result: Promise<any>, successMsg: string, errorMsg: string) {
        this.handleLookupResult(result, successMsg, errorMsg)
            .then(result => BookAPI.respondToRequest(response, result));
    }

    public getAllBooks = (req: Request, res: Response) => {
        BookAPI.respondWithLookupResult(
            res,
            this.dbConnection.getAllCopies(),
            'Retrieved all books in the library',
            'Failed to retrieve all books in the library'
        );
    };

    public getUserByUserName = (req: Request, res: Response) => {
        if (!checkRequestForProperties(req, res, ['name'])) return;

        BookAPI.respondWithLookupResult(
            res,
            this.dbConnection.getUser(escape(req.query.name)),
            'Retrieved user with given name',
            'Failed to retrieve user'
        );
    }

    public getBooksBorrowedByUser = (req: Request, res: Response) => {
        if (!checkRequestForProperties(req, res, ['userid'])) return;

        BookAPI.respondWithLookupResult(
            res,
            this.dbConnection.getBooksBorrowedBy(Number(req.query.userid)),
            'Retrieved books borrowed',
            'Failed to retrieve books borrowed'
        );
    }
}