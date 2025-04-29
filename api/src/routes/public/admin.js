const express = require('express');
var router = express.Router({mergeParams: true});

const authRouter = require('./admin/auth.js');

router.use('/auth', authRouter);

module.exports = router;