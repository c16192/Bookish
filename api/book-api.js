"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DBConnection_1 = require("./DBConnection");
var BookAPI = /** @class */ (function () {
    function BookAPI(db) {
        var _this = this;
        this.getAllBooks = function (req, res) {
            _this.dbConnection.getAllCopies()
                .then(function (data) {
                res.status(200)
                    .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved all books in the library'
                });
            })
                .catch(function (err) {
                res.status(404)
                    .json({
                    status: 'error',
                    error: err,
                    message: 'Failed to retrieve all books in the library'
                });
            });
        };
        this.getUserByUserName = function (req, res) {
            //TODO: sanitise input
            _this.dbConnection.getUser(req.query.name)
                .then(function (data) {
                if (data.length == 0) {
                    res.status(200)
                        .json({
                        status: 'failure',
                        message: 'No such user'
                    });
                    return;
                }
                res.status(200)
                    .json({
                    status: 'success',
                    data: data[0],
                    message: 'Retrieved user with given name'
                });
            })
                .catch(function (err) {
                res.status(404)
                    .json({
                    status: 'error',
                    error: err,
                    message: 'Failed to retrieve all books in the library'
                });
            });
        };
        if (db === undefined) {
            db = new DBConnection_1.DBConnection();
        }
        this.dbConnection = db;
    }
    return BookAPI;
}());
exports.default = BookAPI;
//# sourceMappingURL=book-api.js.map