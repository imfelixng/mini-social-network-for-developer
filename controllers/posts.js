//import Post model
import Post from '@local_models/post';
import Profile from '@local_models/profile';

// import validate post
import ValidatePostInput from '@local_validations/post';


const getAllPosts = async (req, res, next) => {

    const errors = {};

    let posts = null;

    try {
        
        posts = await Post.find().sort({date: -1}).populate('user', "name avatar");

    } catch (error) {
        errors.err = error.message;
        return res.status(404).json(errors);
    }

    return res.status(200).json(posts);
}

const getPost = async (req, res, next) => {

    const errors = {};

    let post = null;

    try {
        
        post = await Post.findById(req.params.id).sort({date: -1}).populate('user', "name avatar");

    } catch (error) {
        errors.nopost = "Not found post for that ID";
        errors.err = error.message;
        return res.status(404).json(errors);
    }

    if(!post) {
        errors.nopost = "Not found post for that ID"
        return res.status(404).json(errors);
    }

    return res.status(200).json(post);
}

const createPost = async (req, res, next) => {
    
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
        errors.err = "That post isn't created";
        return res.status(500).json(errors);
    }

    return res.status(200).json(post);
}

const deletePost = async (req, res, next) => {
    const errors = {};
    let profile = null;

    try {
        profile = await Profile.findOne({user: req.user.id});
    } catch (error) {
        errors.noprofile = "Not found profile for that user";
        return res.status(404).json(errors);
    }

    if(!profile) {
        errors.noprofile = "Not found profile for that user";
        return res.status(404).json(errors);
    }

    let post = null;
    try {
        post = await Post.findById(req.params.id);
    } catch (error) {
        errors.nopost = "Not found post for that ID";
        return res.status(404).json(errors);
    }

    if(!post) {
        errors.nopost = "Not found post for that ID";
        return res.status(404).json(errors);
    }

    if(post.user.toString() !== req.user.id) {
        errors.noauthor = "User not authorized";
        return res.status(401).json(errors);
    }

    let postDeleted = null;

    try {
        postDeleted = post.remove();    
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!postDeleted) {
        errors.nodeleted = "That post is not deleted";
        return res.status(500).json(errors);
    }

    return res.status(200).json({
        success: true
    });
}

const likePost = async (req, res, next) => {
    const errors = {};
    let profile = null;

    try {
        profile = await Profile.findOne({user: req.user.id});
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!profile) {
        errors.err = "Not found profile for that user";
        return res.status(404).json(errors);
    }

    let post = null;

    try {
        post = await Post.findById(req.params.id);
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!post) {
        errors.err = "Not found post for that ID";
        return res.status(404).json(errors);
    }

    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        errors.alreadyliked = "That user liked post";
        return res.status(400).json(errors)
    }

    //Like post
    post.likes.unshift({user: req.user.id});

    let postUpdated = null;

    try {
        postUpdated = await post.save();
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!postUpdated) {
        errors.nolike = "That post isn't liked";
        return res.status(500).json(errors);
    }

    return res.status(200).json({success: true, postUpdated});
}

const unlikePost = async (req, res, next) => {
    const errors = {};
    let profile = null;

    try {
        profile = await Profile.findOne({user: req.user.id});
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!profile) {
        errors.err = "Not found profile for that user";
        return res.status(404).json(errors);
    }

    let post = null;

    try {
        post = await Post.findById(req.params.id);
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!post) {
        errors.err = "Not found post for that ID";
        return res.status(404).json(errors);
    }

    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        errors.notfound = "That post isn't liked by user";
        return res.status(404).json(errors);
    }

    post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);

    let postUpdated = null;

    try {
        postUpdated = await post.save();
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!postUpdated) {
        errors.nounlike = "That post isn't uniked";
        return res.status(500).json(errors);
    }
    return res.status(200).json({success: true, postUpdated});
}

const addComment = async (req, res, next) => {
    const {errors, isValid} = ValidatePostInput(req.body);

    if(!isValid) {
        return res.status(400).json({
            errors
        });
    }
    
    let profile = null;

    try {
        profile = await Profile.findOne({user: req.user.id});
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!profile) {
        errors.err = "Not found profile for that user";
        return res.status(404).json(errors);
    }

    let post = null;

    try {
        post = await Post.findById(req.params.id);
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!post) {
        errors.err = "Not found post for that ID";
        return res.status(404).json(errors);
    }

    const newComment = {
        text: req.body.text,
        nmae: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    }

    post.comments.unshift(newComment);
    let  postUpdated = null;
    try {
        postUpdated = await post.save();
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!postUpdated) {
        errors.nounlike = "That post isn't uniked";
        return res.status(500).json(errors);
    }

    return res.status(200).json({success: true, postUpdated});
}

const deleteComment = async (req, res, next) => {
    const errors = {};
    let profile = null;

    try {
        profile = await Profile.findOne({user: req.user.id});
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!profile) {
        errors.err = "Not found profile for that user";
        return res.status(404).json(errors);
    }

    let post = null;

    try {
        post = await Post.findById(req.params.id);
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!post) {
        errors.err = "Not found post for that ID";
        return res.status(404).json(errors);
    }

    if(post.comments.filter(comment => comment.id.toString() === req.params.comment_id).length === 0) {
        errors.nocomment = "Not found comment for that comment ID";
        return res.status(404).json(errors);
    }

    post.comments = post.comments.filter(comment => comment.id.toString() !== req.params.comment_id);
    let  postUpdated = null;
    try {
        postUpdated = await post.save();
    } catch (error) {
        errors.err = error.message;
        return res.status(500).json(errors);
    }

    if(!postUpdated) {
        errors.nounlike = "That post isn't uniked";
        return res.status(500).json(errors);
    }

    return res.status(200).json({success: true, postUpdated});
}

export {
    getAllPosts,
    getPost,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment
}