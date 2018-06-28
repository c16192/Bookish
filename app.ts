require('dotenv').config();

import {Request, Response} from "express"
import BookAPI from "./api/book-api";

const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/allBooks', BookAPI.getAllBooks);

app.listen(3000, () => console.log('Example app listening on port 3000!'));