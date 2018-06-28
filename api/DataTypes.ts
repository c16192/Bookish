//TODO cross-check column names and types with the database

import {Moment} from "moment";
import moment = require("moment");

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

function getBorrow(user, copy: RawBookCopy) {
    if (user === null) return null;

    return {
        borrower: user,
        borrowDate: moment(copy.borrowdate),
        dueDate: moment(copy.duedate)
    };
}

export function getBookCopy(user: User, book: Book, rawCopy: RawBookCopy): BookCopy {
    const borrow = getBorrow(user, rawCopy);

    return {
        barcode: rawCopy.barcode,
        book: book,
        borrow: borrow
    };
}

export function getRawBookCopy(copy: BookCopy): RawBookCopy {
    if (copy.borrow == null) {
        return {
            barcode: copy.barcode,
            book: copy.book.id,
            borrowerid: null,
            borrowdate:  null,
            duedate: null
        };
    }

    return {
        barcode: copy.barcode,
        book: copy.book.id,
        borrowerid: copy.borrow.borrower.id,
        borrowdate:  copy.borrow.borrowDate.toISOString(),
        duedate: copy.borrow.dueDate.toISOString()
    };
}