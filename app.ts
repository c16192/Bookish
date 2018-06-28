import {DBConnection} from "./api/DBConnection";

require('dotenv').config();

import {Request, Response} from "express"
import BookAPI from "./api/book-api";

const express = require('express');
const app = express();
const dbconnect = new DBConnection();
const bookAPI = new BookAPI(dbconnect);

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/allBooks', bookAPI.getAllBooks);
app.get('/getUser', bookAPI.getUserByUserName);

app.listen(3000, () => console.log('Example app listening on port 3000!'));