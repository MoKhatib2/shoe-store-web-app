const express = require('express');
var router = express.Router({mergeParams: true});

const authRouter = require('./customer/auth.js');
const shoesRouter = require('./customer/shoes.js');

router.use('/auth', authRouter);
router.use('/shoes', shoesRouter);

module.exports = router;