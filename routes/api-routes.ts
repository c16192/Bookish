import BookAPI from "../api/book-api";
import {DBConnection} from "../api/DBConnection";

const routes = require('express').Router();

export function initialiseBookAPIRoutes(dbConnection: DBConnection) {
    const bookAPI = new BookAPI(dbConnection);
    routes.get('/allBooks', bookAPI.getAllBooks);
    routes.get('/getUser', bookAPI.getUserByUserName);
    routes.get('/getBooksBorrowed', bookAPI.getBooksBorrowedByUser);

    return routes
}