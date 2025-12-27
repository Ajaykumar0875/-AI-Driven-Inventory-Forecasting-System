const express = require('express');
const router = express.Router();
const { getProductsAndAlerts } = require('../controllers/product.controller');

router.get('/alerts', getProductsAndAlerts);

module.exports = router;
