const express = require('express');
const dotenv = require('dotenv');
const path=require('path')
const passport = require("passport");
const session = require('express-session');
require("./config/passport");


const cookieParser = require('cookie-parser');
const connectDB = require('./config/db'); // Import the database connection
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoute=require('./routes/payment');
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


// Session middleware (for Passport)
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoute); 
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 