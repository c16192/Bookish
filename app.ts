import {Request, Response} from "express"
import BookAPI from "./api/book-api";

const express = require('express');
const app = express();
require('dotenv').config();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
});

app.get('/allBooks', BookAPI.getAllBooks);

app.listen(3000, () => console.log('Example app listening on port 3000!'))