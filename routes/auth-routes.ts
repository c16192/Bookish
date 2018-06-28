const routes = require('express').Router();

routes.post("/login", (req, res) => {
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
});

routes.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    console.log(req.get('Authorization'));
    res.json("Success! You can not see this without a token");
});

module.exports = routes;