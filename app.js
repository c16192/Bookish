"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DBConnection_1 = require("./api/DBConnection");
require('dotenv').config();
var book_api_1 = require("./api/book-api");
var express = require('express');
var app = express();
var dbconnect = new DBConnection_1.DBConnection();
var bookAPI = new book_api_1.default(dbconnect);
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
app.get('/allBooks', bookAPI.getAllBooks);
app.get('/getUser', bookAPI.getUserByUserName);
app.listen(3000, function () { return console.log('Example app listening on port 3000!'); });
//# sourceMappingURL=app.js.map