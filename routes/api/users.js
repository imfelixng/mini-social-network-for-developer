const express = require('express');
const router  =express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../../models/user');
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
    
    let checkUser = null;
    
    try {
        checkUser = await User.findOne({email: req.body.email});
    } catch (error) {
        console.log(error);
    }

    if(checkUser) {
        return res.status(400).json({
            email: 'Email already exists'
        });
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

module.exports = router;