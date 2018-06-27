"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pgp = require('pg-promise')( /*options*/);
var db = pgp(process.env.POSTGRES_URI);
var BookAPI = /** @class */ (function () {
    function BookAPI() {
    }
    BookAPI.getAllBooks = function (req, res) {
        db.any('select * from Copies')
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
                status: 'failure',
                error: err,
                message: 'Failed to retrieve all books in the library'
            });
        });
    };
    return BookAPI;
}());
exports.default = BookAPI;
//# sourceMappingURL=book-api.js.map