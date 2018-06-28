import Authenticate from "../auth/auth";
import {DBConnection} from "../api/DBConnection";

const routes = require('express').Router();
const path = require('path');
import * as passport from 'passport';

const Auth = new Authenticate();

routes.post("/login", Auth.userAuthenticate);

routes.get('/login', (req, res) => {
   res.sendFile(path.join(__dirname + '/../views/login.html'));
});

routes.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    console.log(req.get('Authorization'));
    res.json("Success! You can not see this without a token");
});

module.exports = routes;
