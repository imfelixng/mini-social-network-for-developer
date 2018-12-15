const express = require('express');
const router  =express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load profile Model
const Profile = require('../../models/profile');

//Load user profile
const User = require('../../models/user');

//@route    GET api/profile/test
//@desc     Test profile route
//@access   Public
router.get('/test', (req, res, next) => {
    res.json({
        msg: 'Profile works'
    });
});

//@route    GET api/profile
//@desc     Get current user profile
//@access   Private
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    
    const errors = {};

    let profile = null;

    try {
        profile = await Profile.findOne({user: req.user.id});
    } catch (error) {
        return res.status(404).json(err);
    }
    
    if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
    }
    return res.status(200).json(profile);
    
});


module.exports = router;