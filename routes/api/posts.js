const express = require('express');
const router  =express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//import Post model
const Post = require('@local_models/post');

// import validate post
const ValidatePostInput = require('@local_validations/post');

//@route    GET api/posts/test
//@desc     Test post route
//@access   Public
router.get('/test', (req, res, next) => {
    res.json({
        msg: 'Posts works'
    });
});

//@route    POST api/posts
//@desc     Create post
//@access   Private
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
    
    const {errors, isValid} = ValidatePostInput(req.body);

    if(!isValid) {
        return res.status(400).json({
            errors
        });
    }

    const newPost = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    }

    const post = null;

    try {
        post = await newPost.save();
    } catch (error) {
        return res.status(500).json({
            error
        })
    }

    if(!post) {

    }


});

module.exports = router;