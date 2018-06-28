import ViewController from "../viewController/viewController";
import {Request, Response} from "express";
const routes = require('express').Router();

export function initialiseAppRoutes() {
    routes.get('/', ViewController.showIndex);
    routes.get('/allBooks', ViewController.getAllBooks);
    routes.get('/getUser', ViewController.getUserByUserName);
    routes.get('/getBooksBorrowed', ViewController.getBooksBorrowedByUser);

    return routes
}