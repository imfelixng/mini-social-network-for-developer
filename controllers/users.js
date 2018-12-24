import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Load Input Validation
import validateRegisterInput from '@local_validations/register';
import validateLoginInput from '@local_validations/login';

//Load key
import key from '@local_configs/key';
//Load User Model
import User from '@local_models/user';


const register = async (req, res, next) => {
    
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
}

const login = async (req, res, next) => {

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
}

const currentUser = (req, res, next) => {
    return res.status(200).json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
}

export {
    register,
    login,
    currentUser
}