import Authenticate from "../auth/auth";

const routes = require('express').Router();
const path = require('path');

const Auth = new Authenticate();

routes.post("/login", Auth.userAuthenticate);

routes.get('/login', (req, res) => {
   res.sendFile(path.join(__dirname + '/../views/login.html'));
});

routes.get("/secret", Auth.passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.get('Authorization'));
    res.json("Success! You can not see this without a token");
});

module.exports = {
    router: routes,
    auth: Auth
};
