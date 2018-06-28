var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var users = require('../auth/user');
var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: 'secret'
};
var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    var user = users.findIndex(users, { id: jwt_payload.id });
    if (user) {
        next(null, user);
    }
    else {
        next(null, false);
    }
});
passport.use(strategy);
//# sourceMappingURL=auth.js.map