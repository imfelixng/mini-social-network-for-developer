const express = require('express');
const router  =express.Router();

//@route    GET api/users/test
//@desc     Test user route
//@access   Public
router.get('/test', (req, res, next) => {
    res.status(200).json({
        msg: 'Users works'
    });
});

module.exports = router;