import {
  Strategy as JWTStrategy,
  ExtractJwt,
} from 'passport-jwt';
import mongoose from 'mongoose';

// eslint-disable-next-line import/no-unresolved
import key from '@local_configs/key';

const User = mongoose.model('users');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secretOrKey;

export default (passport) => {
  passport.use(new JWTStrategy(opts, async (jwtPayload, done) => {
    let user = null;
    try {
      user = await User.findById(jwtPayload.id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    if (!user) {
      done(null, false);
    }
    return done(null, user);
  }));
};
