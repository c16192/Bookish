require('dotenv').config();

import {Request, Response} from "express"
import BookAPI from "./api/book-api";

const express = require('express');
const app = express();
const bookAPI = new BookAPI();

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/allBooks', bookAPI.getAllBooks);

app.listen(3000, () => console.log('Example app listening on port 3000!'));