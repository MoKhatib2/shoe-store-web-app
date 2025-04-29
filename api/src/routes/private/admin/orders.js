const express = require('express');
var router = express.Router({mergeParams: true});

const ordersController = require('../../../controllers/admin/ordersController.js');

router.get('/getOrders', ordersController.getOrders);
router.post('/editStatus', ordersController.editOrderStatus);


module.exports = router;