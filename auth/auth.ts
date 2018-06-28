import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const users = require('../auth/user')

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: 'secret'
}

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    const user = users.findIndex(users, {id: jwt_payload.id});
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
        if(req.body.name && req.body.password){
            const name = req.body.name;
            const password = req.body.password;
            user = users.findIndex(users, {name: name});
        }
        // usually this would be a database call:
        if(!user){
            res.status(401).json({message:"no such user found"});
        }
        if(user.password === req.body.password) {
            const payload = {id: user.id};
            const token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({message: "ok", token: token});
        } else {
            res.status(401).json({message:"passwords did not match"});
        }
    }
}