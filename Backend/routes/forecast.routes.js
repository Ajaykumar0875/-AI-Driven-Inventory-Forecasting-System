const express = require('express');
const router = express.Router();
const { generateForecasts, getForecasts } = require('../controllers/forecast.controller');

// Trigger generation (Calls AI)
router.post('/generate', generateForecasts); 

// View existing
router.get('/', getForecasts);

module.exports = router;
