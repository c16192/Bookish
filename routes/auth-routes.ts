import Authenticate from "../auth/auth";

const routes = require('express').Router();
const path = require('path');
import {DBConnection} from "../api/DBConnection";

export function initialiseAuthenticationRoutes(dbConnection: DBConnection) {
    const Auth = new Authenticate(dbConnection);
    const AuthCheck = Auth.passport.authenticate('jwt', {
        session: false,
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page. THIS IS JUST FOR TESTING TO SEE IF THE REDIRECT ON FAIL WORKS.
    });
    // Auth.passport.serializeUser(function(user, callback) {
    //     callback(null, user);
    // });

    routes.post("/login", Auth.userAuthenticate, (req, res)=>{
        res.redirect('/');
    });

    routes.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname + '/../views/login.html'));
    });

    routes.get("/account", AuthCheck, (req, res) => {
        console.log(req.get('Authorization'));
        res.json("Success! You can not see this without a token");
    });

    return {
        router: routes,
        auth: Auth,
        AuthCheck: AuthCheck,
    };
}