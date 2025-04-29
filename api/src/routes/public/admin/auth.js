const express = require('express');
const router = express.Router({mergeParams: true});

const authController = require('../../../controllers/admin/authController.js');

router.post('/login', authController.login);

module.exports = router

