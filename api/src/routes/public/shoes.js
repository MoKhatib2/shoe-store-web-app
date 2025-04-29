const express = require('express');
var router = express.Router({mergeParams: true});

const shoesController = require('../../controllers/customer/shoesController.js');

router.post('/add', shoesController.addShoe);
router.delete('/remove/:id', shoesController.removeShoe);
router.get('/getShoes', shoesController.getShoes);
router.get('/search', shoesController.searchShoes);

router.post('/addBrand', shoesController.addBrand);

module.exports = router;