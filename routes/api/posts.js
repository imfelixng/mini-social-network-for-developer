import express from 'express';
const router  =express.Router();
import passport from 'passport';

//import Post model
import Post from '@local_models/post';

// import validate post
import ValidatePostInput from '@local_validations/post';

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
        console.log(isValid);
        return res.status(400).json({
            errors
        });
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    let post = null;

    try {
        post = await newPost.save();
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!post) {
        errors.err = "This post isn't created";
        return res.status(500).json(errors);
    }

    return res.status(200).json(post);

});

module.exports = router;