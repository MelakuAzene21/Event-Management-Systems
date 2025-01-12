const express = require('express');
const dotenv = require('dotenv');
const path=require('path')
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db'); // Import the database connection
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Load environment variables
dotenv.config();

// Initialize the application
const app = express();
const cors = require('cors');
// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:3000',  // Your frontend's URL
    credentials: true                // Allow cookies to be sent along with requests
}));
// Middleware
app.use(express.json());
app.use(cookieParser()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
  
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
