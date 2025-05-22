const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router({mergeParams: true});
const adminRouter = require('./private/admin.js');
const customerRouter = require('./private/customer.js');

const JWT_SECRET = process.env.JWT_SECRET;

router.all("*", (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({errorMessage: 'INVALID_TOKEN'});
            } else {
                req.decoded = decoded;
                req.userId = decoded.userId;
                req.userType = decoded.userType;
                next();
            }
        })
    } else {
        res.status(403).json({errorMessage: 'NO_TOKEN'})
    }
});

router.use('/admin', adminRouter);
router.use('/customer', customerRouter);

module.exports = router;