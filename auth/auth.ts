import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import {DBConnection} from "../api/DBConnection";

const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: 'secret'
};

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    //TODO: restructure this
    const user = new DBConnection().getUser(jwt_payload.id);
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);

export default class Authenticate {
    public userAuthenticate = (req, res) => {
        let user;
        if (req.body.name && req.body.password) {
            const name = req.body.name;
            const password = req.body.password;
            //TODO: restructure this
            user = (new DBConnection().getUser(name));
        }
        // usually this would be a database call:
        if (!user) {
            res.status(401).json({message: "no such user found"});
        }
        if (user.password === req.body.password) {
            const payload = {id: user.id};
            const token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({message: "ok", token: token});
        } else {
            res.status(401).json({message: "passwords did not match"});
        }
    }
}