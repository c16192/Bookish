import * as jwt from 'jsonwebtoken';
import {DBConnection} from "../api/DBConnection";
import * as passportJWT from "passport-jwt";
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) token = req.cookies['jwt'];
    return token;
};

export default class Authenticate {
    public passport;
    public jwtOptions = {
        // jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        jwtFromRequest: cookieExtractor,
        // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
            this.dbConnection.getUserById(jwt_payload.id).then((user)=>{
                console.log(user);
                if (user) {
                    next(null, user);
                } else {
                    next(null, false);
                }
            });
        });
        this.passport =  require("passport").use(strategy);
    }

    public userAuthenticate = (req, res) => {
        if (req.body.name && req.body.password) {
            const name = req.body.name;
            const password = req.body.password;
            console.log(name, password);
            this.dbConnection.getUser(name).then((user)=>{
                if (user.passwordhash === req.body.password) {
                    const payload = {id: user.id};
                    let token = jwt.sign(payload, this.jwtOptions.secretOrKey);
                    const cookieOptions = {
                        httpOnly: false,
                        expires: 60* 60
                    }
                    console.log("token: "+token)
                    res.cookie('jwt', token, cookieOptions);
                    res.redirect('/');
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