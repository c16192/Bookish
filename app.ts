import {DBConnection} from "./api/DBConnection";
import {initialiseAuthenticationRoutes} from "./routes/auth-routes";

require('dotenv').config();

import {Request, Response} from "express"
import BookAPI from "./api/book-api";

const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const dbconnect = new DBConnection();
const bookAPI = new BookAPI(dbconnect);
const bodyParser = require("body-parser");
const Auth = initialiseAuthenticationRoutes(dbconnect);

// app.use(cookieSession({
//     name: 'session',
//     maxAge: 60 * 60,
//     keys: ["ajigoejaigjwelglakwejawj"]
// }));
app.use(Auth.auth.passport.initialize());
app.use(Auth.auth.passport.session());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(Auth.router);

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/allBooks', bookAPI.getAllBooks);
app.get('/getUser', bookAPI.getUserByUserName);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
