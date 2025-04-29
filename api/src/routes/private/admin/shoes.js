const express = require('express');
var router = express.Router({mergeParams: true});

const shoesController = require('../../../controllers/admin/shoesController.js');

router.post('/addShoe', shoesController.addShoe);
router.post('/addVariant/:shoeId', shoesController.addVariant);
router.post('/editShoe/:shoeId', shoesController.editShoe);
router.post('/editVariant/:shoeId/:variantId', shoesController.editVariant);
router.post('/addBrand', shoesController.addBrand);
router.get('/getShoes', shoesController.getShoes);
router.get('/searchShoes', shoesController.searchShoes);

module.exports = router;