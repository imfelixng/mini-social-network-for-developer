import { Strategy as JWTStrategy} from 'passport-jwt';
import {ExtractJwt} from 'passport-jwt';
import mongoose from'mongoose';

const User = mongoose.model('users');
import key from '@local_configs/key';

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