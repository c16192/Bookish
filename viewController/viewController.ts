import {Request, Response} from "express";
import * as path from "path";

export default class ViewController {
    public static showIndex(req: Request, res: Response) {
        res.render('index');
    }

    public static getAllBooks(req: Request, res: Response) {
        res.render('index');
    }

    public static getUserByUserName(req: Request, res: Response) {
        res.render('index');
    }

    public static getBooksBorrowedByUser(req: Request, res: Response) {
        res.render('index');
    }
}