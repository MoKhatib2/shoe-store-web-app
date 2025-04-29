const express = require('express');
var router = express.Router({mergeParams: true});

const shoesController = require('../../../controllers/customer/shoesController.js');

router.get('/getShoes', shoesController.getShoes);
router.get('/searchShoes', shoesController.searchShoes);

module.exports = router