const express = require('express');
const router  =express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('local_models/post');

//@route    GET api/posts/test
//@desc     Test post route
//@access   Public
router.get('/test', (req, res, next) => {
    res.json({
        msg: 'Posts works'
    });
});

//@route    GET api/posts/test
//@desc     Test post route
//@access   Public
router.get('/test', (req, res, next) => {
    res.json({
        msg: 'Posts works'
    });
});

module.exports = router;