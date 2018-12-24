import express from 'express';
const router  =express.Router();
import passport from 'passport';

import {register, login, currentUser} from '@local_controllers/users';

//@route    GET api/users/register
//@desc     Register user
//@access   Public
router.post('/register', register);

//@route    GET api/users/login
//@desc     Login user / Returning JWT token
//@access   Public
router.post('/login', login);

//@route    GET api/users/current
//@desc     Return current user
//@access   Private
router.get('/current', passport.authenticate('jwt', {session: false}), currentUser);

export default router;