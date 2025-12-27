const express = require('express');
const router = express.Router();
const { getSalesHistory } = require('../controllers/sales.controller');

router.get('/', getSalesHistory);

module.exports = router;
