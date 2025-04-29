const express = require('express');
var router = express.Router({mergeParams: true});

const adminRouter = require('./public/admin.js');
const customerRouter = require('./public/customer.js');

router.use('/customer', customerRouter);
router.use('/admin', adminRouter);

module.exports = router;