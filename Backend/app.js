const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Initialize App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging

// Routes (Placeholders for now)
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/forecast', require('./routes/forecast.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/sales', require('./routes/sales.routes'));
app.use('/api/chat', require('./routes/chat.routes'));

// Error Handling Middleware (Should be last)
app.use(errorHandler);

module.exports = app;
