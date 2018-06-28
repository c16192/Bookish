import {Request, Response} from "express";
import * as path from "path";

export default class ViewController {
    public static showIndex(req: Request, res: Response) {
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    }

    public static getAllBooks(req: Request, res: Response) {
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    }

    public static getUserByUserName(req: Request, res: Response) {
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    }

    public static getBooksBorrowedByUser(req: Request, res: Response) {
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    }
}