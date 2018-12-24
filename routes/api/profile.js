import express from 'express';
const router  =express.Router();
import passport from 'passport';

import { 
    getCurrentProfile, 
    getAllProfiles,
    getProfileByUserID,
    getProfileByHandle,
    createAndEditProfile,
    addExperience,
    addEducation,
    deleteExperience,
    deleteEducation,
    deleteProfile
} from "@local_controllers/profiles";

//@route    GET api/profile
//@desc     Get current user profile
//@access   Private
router.get('/', passport.authenticate('jwt', {session: false}), getCurrentProfile);

//@route    GET api/profile/all
//@desc     Get all profile
//@access   Public
router.get('/all', getAllProfiles);

//@route    GET api/profile/user/:user_id
//@desc     Get profile by user ID
//@access   Public
router.get('/user/:user_id', getProfileByUserID);

//@route    GET api/profile/handle/:handle
//@desc     Get profile by handle
//@access   Public
router.get('/handle/:handle', getProfileByHandle);

//@route    POST api/profile
//@desc     Create or Edit user profile
//@access   Private
router.post('/', passport.authenticate('jwt', {session: false}), createAndEditProfile);

//@route    POST api/profile/experience
//@desc     Add experience to profile
//@access   Private
router.post('/experience', passport.authenticate('jwt', {session: false}), addExperience);

//@route    POST api/profile/education
//@desc     Add education to profile
//@access   Private
router.post('/education', passport.authenticate('jwt', {session: false}), addEducation);

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete experience from profile
//@access   Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), deleteExperience);

//@route    DELETE api/profile/education/:edu_id
//@desc     Delete education from profile
//@access   Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), deleteEducation);

//@route    DELETE api/profile
//@desc     Delete profile
//@access   Private
router.delete('/', passport.authenticate('jwt', {session: false}), deleteProfile);

export default router;