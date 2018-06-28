import {DBConnection} from "../api/DBConnection";

const jwt = require('jsonwebtoken');
const passport = require("passport");
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