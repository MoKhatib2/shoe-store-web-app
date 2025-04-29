const express = require('express');
var router = express.Router({mergeParams: true});

const shoesRouter = require('./admin/shoes.js');
const ordersRouter = require('./admin/orders.js');

// router.all("*", (req, res, next) => {
//    const userType = req.userType;
//    if (userType ==  'admin') {
//     next();
//    } else {
//     res.status(403).json({errorMessage: 'UNAUTHORIZED_USER'});
//    }

// });

router.use('/shoes', shoesRouter);
router.use('/orders', shoesRouter);

module.exports = router;