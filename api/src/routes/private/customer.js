const express = require('express');
var router = express.Router({mergeParams: true});

const userRouter = require('./customer/user.js');

router.use('/user', userRouter);

module.exports = router;