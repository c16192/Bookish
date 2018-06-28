require('dotenv').config();

import {Request, Response} from "express"
import BookAPI from "./api/book-api";

const express = require('express');
const app = express();

const bodyParser = require("body-parser");

app.use(express.static('public'));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(require('routes/auth-routes'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/allBooks', BookAPI.getAllBooks);

app.listen(3000, () => console.log('Example app listening on port 3000!'))