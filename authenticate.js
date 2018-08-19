var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');
var crypto = require("crypto");

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

// exports.localLogin =     passport.use('local-login', new LocalStrategy({
//     // by default, local strategy uses username and password, we will override with email
//     usernameField : 'email',
//     passwordField : 'password'
// },
//User.authenticate()));



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {expiresIn: 3600})
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload,done)=>{
        console.log('JWT payload: ', jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user)=>{
            console.log(user);
            if(err){
                console.log("Error")
                return done(err,false)
            }else if(user){
                console.log("Authenticated user (y)");
                return done(null, user);
            }else{
                console.log("no thing at all")
                return done(null,false);
            }
        })
    })
);

exports.verifyUser = passport.authenticate('jwt',{session: false});
exports.verifyAdmin = (req, res, next)=>{
    console.log("the user is " + req.user.admin)
    if(req.user.admin){
        console.log("admin");
        next();
    }else{
        console.log('You are not an admin');
        var err = new Error('You are not authorized to perform this operation!')
        next(err);
    }
};
/*
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));
*/