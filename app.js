"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var book_api_1 = require("./api/book-api");
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
app.use(express.static('public'));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('./routes/auth-routes'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
app.get('/allBooks', book_api_1.default.getAllBooks);
app.listen(3000, function () { return console.log('Example app listening on port 3000!'); });
//# sourceMappingURL=app.js.map