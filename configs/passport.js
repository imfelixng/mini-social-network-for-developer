const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const User = mongoose.model('users');
const key = require('../configs/key');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secretOrKey;

module.exports = (passport) => {
    passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
        
        let user = null;

        try {
            user = await User.findById(jwt_payload.id);
        } catch (error) {
            console.log(error);
        }
        
        if(!user) {
            done(null, false);
        }

        return done(null, user);

    }));
};