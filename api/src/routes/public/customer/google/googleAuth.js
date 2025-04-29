const express = require('express');
var router = express.Router({mergeParams: true});

const googleAuthController = require('../../../../controllers/customer/googleAuthController.js');

router.get('/', googleAuthController.googleRegister);
router.get('/callback', googleAuthController.googleCallback);

module.exports = router;