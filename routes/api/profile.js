const express = require('express');
const router  =express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load profile Model
const Profile = require('../../models/profile');

//Load user profile
const User = require('../../models/user');

//Load validate
const ValidateProfileInput = require('../../validation/profile');

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
        profile = await Profile.findOne({user: req.user.id})
        .populate('user', 'name avatar');
    } catch (error) {
        return res.status(500).json(err);
    }
    
    if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
    }
    return res.status(200).json(profile);
    
});

//@route    GET api/profile/all
//@desc     Get all profile
//@access   Public
router.get('/all', async (req, res, next) => {
    let errors = {};
    let profiles = [];

    try {
        profiles = await Profile.find().populate('user', 'name avatar');
    } catch (error) {
        return res.status(500).json(error);
    }

    if(!profiles.length > 0) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
    }
    return res.status(200).json({profiles});


});

//@route    GET api/profile/user/:user_id
//@desc     Get profile by user ID
//@access   Public
router.get('/user/:user_id', async (req, res, next) => {
    const errors = {};
    let profile = null;

    try {
        profile = await Profile.findOne({user: req.params.user_id})
        .populate('user', 'name avatar');
    } catch (error) {
        return res.status(500).json(error);
    }

    if(!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
    }

    return res.status(200).json(profile);

});

//@route    GET api/profile/handle/:handle
//@desc     Get profile by handle
//@access   Public
router.get('/handle/:handle', async (req, res, next) => {
    const errors = {};
    let profile = null;

    try {
        profile = await Profile.findOne({handle: req.params.handle})
        .populate('user', 'name avatar');
    } catch (error) {
        return res.status(500).json(error);
    }

    if(!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(404).json(errors);
    }

    return res.status(200).json(profile);

});

//@route    POST api/profile
//@desc     Create or Edit user profile
//@access   Private
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    
    const {errors, isValid} = ValidateProfileInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {}

    profileFields.user = req.user.id;

    if(req.body.handle) {
        profileFields.handle = req.body.handle;
    }

    if(req.body.company) {
        profileFields.company = req.body.company;
    }

    if(req.body.website) {
        profileFields.website = req.body.website;
    }

    if(req.body.location) {
        profileFields.location = req.body.location;
    }

    if(req.body.status) {
        profileFields.status = req.body.status;
    }

    if(req.body.bio) {
        profileFields.bio = req.body.bio;
    }
    
    if(req.body.githubusername) {
        profileFields.githubusername = req.body.githubusername;
    }

    //Skills 
    if(typeof req.body.skills !== 'undefined' || typeof req.body.skills !== 'null') {
        profileFields.skills = req.body.skills.split(',');
    }

    //Social
    profileFields.social = {};
    if(req.body.youtube) {
        profileFields.social.youtube = req.body.youtube;
    }
    if(req.body.twitter) {
        profileFields.social.twitter = req.body.twitter;
    }
    if(req.body.facebook) {
        profileFields.social.facebook = req.body.facebook;
    }
    if(req.body.linkedin) {
        profileFields.social.linkedin = req.body.linkedin;
    }  
    if(req.body.instagram) {
        profileFields.social.instagram = req.body.instagram;
    }  

    let profile = null;

    try {
        profile = await Profile.findOne({user: req.user.id})
    } catch (error) {
        return res.status(500).json(error);
    }

    if(profile) {
        //Update
        let updatedProfile = null;

        try {
            updatedProfile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true});
        } catch (error) {
            return res.status(500).json(error);
        }

        if(updatedProfile) {
            return res.status(200).json(updatedProfile);
        }
        
    } else {
        //Create

        //Check handle exists

        let checkHandleProfile = null;

        try {
            checkHandleProfile = await Profile.findOne({handle: profileFields.handle});
        } catch (error) {
            return res.status(500).json(error);
        }

        if(checkHandleProfile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
        }

        let newProfile = null;

        try {
            newProfile =  await new Profile(profileFields).save();         
        } catch (error) {
            return res.status(500).json(error);
        }

        if(newProfile) {
            return res.status(200).json(newProfile);
        }
        


    }


});

module.exports = router;