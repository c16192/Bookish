import {DBConnection} from "./api/DBConnection";
import {initialiseAuthenticationRoutes} from "./routes/auth-routes";
import * as log4js from 'log4js';

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

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' },
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['file', 'console'], level: 'debug'},
        bookAPI: { appenders: ['file', 'console'], level: 'debug'}
    }
});
const logger = log4js.getLogger();

app.use('/', express.static('public'));
app.set('view engine', 'ejs');

app.use(Auth.auth.passport.initialize());
app.use(Auth.auth.passport.session());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(Auth.router);
app.use('/api', initialiseBookAPIRoutes(dbconnect));
app.use(initialiseAppRoutes());

logger.info("Starting listening on port 3000");
app.listen(3000, () => logger.info('Started listening on port 3000'));