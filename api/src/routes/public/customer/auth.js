const express = require('express');
var router = express.Router({mergeParams: true});

const googleAuthRouter = require('./google/googleAuth.js');
const {login, signup, verify, resendCode, forgotPassword, changePassword}  = require('../../../controllers/customer/authController.js');

router.use('/google', googleAuthRouter);
router.post('/login', login);
router.post('/signup', signup);
router.post('/verify', verify);
router.post('/resend-code/:userId', resendCode);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);

module.exports = router;