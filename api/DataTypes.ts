//TODO cross-check column names and types with the database

import {Moment} from "moment";

export interface Book {
    id: number,
    title: string,
    author: string,
    ISBN: string
}

export interface User {
    id: number,
    username: string,
    firstname: string,
    lastname: string
}

export interface RawBookCopy {
    barcode: number,
    book: number,
    borrowerid: number,
    borrowdate:  string,
    duedate: string
}

export interface BookCopy {
    barcode: number,
    book: Book,
    borrow: {
        borrower: User,
        borrowDate: Moment,
        dueDate: Moment
    } | null
}