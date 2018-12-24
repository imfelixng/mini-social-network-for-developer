import express from 'express';
const router  =express.Router();
import passport from 'passport';

import {
    getAllPosts,
    getPost,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment
} from '@local_controllers/posts';


//@route    GET api/posts
//@desc     Get posts
//@access   Public
router.get('/', getAllPosts);

//@route    GET api/posts/:id
//@desc     Get post by id
//@access   Public
router.get('/:id', getPost);

//@route    POST api/posts
//@desc     Create post
//@access   Private
router.post('/', passport.authenticate('jwt', {session: false}), createPost);

//@route    DELETE api/posts/:id
//@desc     Delete post by id
//@access   Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), deletePost);

//@route    POST api/posts/like/:id
//@desc     Like post
//@access   Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), likePost);

//@route    POST api/posts/unlike/:id
//@desc     Unlike post
//@access   Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), unlikePost);

//@route    POST api/posts/comment/:id
//@desc     Add comment to post
//@access   Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), addComment);

//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Deleted comment from post by ID
//@access   Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), deleteComment);

export default router;