const express = require('express');
var router = express.Router({mergeParams: true});

const userController = require('../../../controllers/customer/userController.js');

router.get('/getCurrUser', userController.getCurrUser);
router.put('/addToFavourites', userController.addToFavourites);
router.put('/removeFromFavourites', userController.removeFromFavourites);
router.put('/addToCart', userController.addToCart);
router.delete('/removeFromCart', userController.removeFromCart);
router.get('/getCartDetails', userController.getCartDetails);
router.post('/addAddress', userController.addAddress);
router.post('/payByCash', userController.payByCash);
router.get('/getOrders', userController.getOrders);

module.exports = router;  