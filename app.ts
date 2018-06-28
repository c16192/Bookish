import {DBConnection} from "./api/DBConnection";
import {initialiseAuthenticationRoutes} from "./routes/auth-routes";

require('dotenv').config();

import {Request, Response} from "express"
import BookAPI from "./api/book-api";
import {initialiseBookAPIRoutes} from "./routes/api-routes";
import {initialiseAppRoutes} from "./routes/app-routes";

const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const dbconnect = new DBConnection();
const bodyParser = require("body-parser");
const Auth = initialiseAuthenticationRoutes(dbconnect);
const cookieParser = require('cookie-parser');
// app.use(cookieSession({
//     name: 'session',
//     maxAge: 60 * 60,
//     keys: ["ajigoejaigjwelglakwejawj"]
// }));
app.use(Auth.auth.passport.initialize());
app.use(Auth.auth.passport.session());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(Auth.router);
app.use('/api', initialiseBookAPIRoutes(dbconnect));
app.use(initialiseAppRoutes());

app.listen(3000, () => console.log('Example app listening on port 3000!'));
