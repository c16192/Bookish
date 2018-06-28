import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import {DBConnection} from "../api/DBConnection";
import * as passportJWT from "passport-jwt";
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

export default class Authenticate {
    public passport = require("passport");
    public jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: 'secret'
    };
    private dbConnection;

    constructor(db?: DBConnection){
        if (db === undefined) {
            db = new DBConnection();
        }
        this.dbConnection = db;
        const strategy = new JwtStrategy(this.jwtOptions, (jwt_payload, next) => {
            console.log('payload received', jwt_payload);
            //TODO: restructure this
            const user = this.dbConnection.getUser(jwt_payload.id);
            if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });
        passport.use(strategy);
    }

    public userAuthenticate = (req, res) => {
        let user;
        if (req.body.name && req.body.password) {
            const name = req.body.name;
            const password = req.body.password;
            console.log(name, password);
            //TODO: restructure this
            this.dbConnection.getUser(name).then((user)=>{
                console.log(user.passwordhash);
                console.log(req.body.password);
                if (user.passwordhash === req.body.password) {
                    const payload = {id: user.id};
                    const token = jwt.sign(payload, this.jwtOptions.secretOrKey);
                    res.json({message: "ok", token: token});
                } else {
                    res.status(401).json({message: "passwords did not match"});
                }
            }).catch((err)=> {
                res.send(err);
            })
        } else if(!req.body.name) {
            res.status(401).json({message: "You should supply a username"});
        } else if(!req.body.password) {
            res.status(401).json({message: "You should supply a password"});
        }
    }
}