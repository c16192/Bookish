import {DBConnection} from "../api/DBConnection";

const routes = require('express').Router();
const passport = require("passport");
const path = require('path');

routes.post("/login", (req, res) => {
    let user;
    if(req.body.name && req.body.password){
        const name = req.body.name;
        const password = req.body.password;
        //TODO: restructure this
        user = (new DBConnection().getUser(name));
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
});

routes.get('/login', (req, res) => {
   res.sendFile(path.join(__dirname + '/../views/login.html'));
});

routes.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    console.log(req.get('Authorization'));
    res.json("Success! You can not see this without a token");
});

module.exports = routes;