const express = require('express');
const router  =express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('local_validations/register');
const validateLoginInput = require('local_validations/login');

//Load key
const key = require('local_configs/key');

//Load User Model
const User = require('local_models/user');

//@route    GET api/users/test
//@desc     Test user route
//@access   Public
router.get('/test', (req, res, next) => {
    res.status(200).json({
        msg: 'Users works'
    });
});

//@route    GET api/users/register
//@desc     Register user
//@access   Public
router.post('/register', async (req, res, next) => {
    
    const {errors, isValid} = validateRegisterInput(req.body);

    //check validation
    if(!isValid) {
        return res.status(400).json(errors)
    }

    let checkUser = null;
    try {
        checkUser = await User.findOne({email: req.body.email});
    } catch (error) {
        console.log(error);
    }

    if(checkUser) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
    } else {
        const avatar = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, async (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                let user = null;
                try {
                    user = await newUser.save();
                } catch (error) {
                    console.log(error);
                }

                if(user) {
                    return res.status(200).json({
                        user
                    })
                }

            });
        });
    }
});

//@route    GET api/users/login
//@desc     Login user / Returning JWT token
//@access   Public
router.post('/login', async (req, res, next) => {

    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    let user = null;
    try {
        user = await User.findOne({email});
    } catch (error) {
        console.log(error);
    }

    //check user
    if(!user) {
        errors.email = "User not found"
        return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(password, user.password)
    .then((isMatch) => {
        if(isMatch) {
            //User Matched

            //Create JWT Payload
            const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar
            }

            //Sign Token
            jwt.sign(
                payload, 
                key.secretOrKey, 
                { expiresIn: 3600 },
                (err, token) => {
                    if(err) throw err;
                    res.status(200).json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                }
            );

        } else {
            errors.password = 'Password incorrect';
            return res.status(401).json(errors);
        }
    })
});

//@route    GET api/users/current
//@desc     Return current user
//@access   Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    return res.status(200).json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;