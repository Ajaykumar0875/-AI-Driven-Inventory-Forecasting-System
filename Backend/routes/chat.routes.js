const express = require('express');
const router = express.Router();
const { handleChatQuery } = require('../controllers/chat.controller');

router.post('/', handleChatQuery);

module.exports = router;
