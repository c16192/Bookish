import Authenticate from "../auth/auth";

const routes = require('express').Router();
const path = require('path');
import * as passport from 'passport';
import {DBConnection} from "../api/DBConnection";

export function initialiseAuthenticationRoutes(dbConnection: DBConnection) {
    const Auth = new Authenticate(dbConnection);

    routes.post("/login", Auth.userAuthenticate);

    routes.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname + '/../views/login.html'));
    });

    routes.get("/secret", passport.authenticate('jwt', {session: false}), function (req, res) {
        console.log(req.get('Authorization'));
        res.json("Success! You can not see this without a token");
    });

    return routes;
}
