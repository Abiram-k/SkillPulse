const userController = require("../Controller/userController");
const express = require('express');
const router = express.Router();
const passport = require("passport")
const jwt = require("jsonwebtoken")

router.get('/', userController.baseRoute);
router.post('/signUp', userController.signUp);
router.post('/login', userController.login);
router.post('/otp', userController.otp);
router.post('/resendOtp', userController.resendOtp)

router.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));
router.get('/auth/google/callback',
    passport.authenticate('google',
        { failureRedirect: 'http://localhost:5173/login' }),
         (req, res) => {
            res.redirect('http://localhost:5173/home')
        });
module.exports = router;      