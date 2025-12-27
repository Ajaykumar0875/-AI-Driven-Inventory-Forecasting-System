require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db.js');

const PORT = process.env.PORT || 5000;

// DEBUG: Check what env vars are loaded
console.log("Loaded Env Vars:", Object.keys(process.env).filter(key => key.includes('API') || key.includes('MONGO')));

// Connect to Database
connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
