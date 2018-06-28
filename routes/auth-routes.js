var routes = require('express').Router();
var passport = require("passport");
var path = require('path');
routes.post("/login", function (req, res) {
    var user;
    if (req.body.name && req.body.password) {
        var name = req.body.name;
        var password = req.body.password;
        user = users.findIndex(users, { name: name });
    }
    // usually this would be a database call:
    if (!user) {
        res.status(401).json({ message: "no such user found" });
    }
    if (user.password === req.body.password) {
        var payload = { id: user.id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ message: "ok", token: token });
    }
    else {
        res.status(401).json({ message: "passwords did not match" });
    }
});
routes.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/../views/login.html'));
});
routes.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
    console.log(req.get('Authorization'));
    res.json("Success! You can not see this without a token");
});
module.exports = routes;
//# sourceMappingURL=auth-routes.js.map