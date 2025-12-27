const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadCSV } = require('../controllers/upload.controller');

// Configure Multer (Temporary storage for processing)
const upload = multer({ dest: 'uploads/' });

// Route: POST /api/upload
router.post('/', upload.single('file'), uploadCSV);

module.exports = router;
