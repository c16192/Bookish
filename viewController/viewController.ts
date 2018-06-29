import {Request, Response} from "express";
import * as path from "path";
import * as request from "request";

export default class ViewController {
    public static showIndex(req: Request, res: Response) {
        res.render('index');
    }

    public static getAllBooks(req: Request, res: Response) {
        request('http://127.0.0.1:3000/api/allBooks', (error, response, body) => {
            res.render('index', response.body);
        });
    }

    public static getUserByUserName(req: Request, res: Response) {
        res.render('index');
    }

    public static getBooksBorrowedByUser(req: Request, res: Response) {
        res.render('index');
    }
}