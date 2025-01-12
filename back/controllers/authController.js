const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format (basic regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const user = await User.create({ name, email, password });

        // Exclude password from the response
        const { password: _, ...userWithoutPassword } = user._doc;

        res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the password matches
        const isPasswordValid = await user.comparePassword(password); // Assuming comparePassword is a method in your User model
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Exclude password from response
        const { password: _, ...userWithoutPassword } = user._doc;

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, 
            
            { httpOnly: true, 
                secure: false,
                 sameSite: 'strict' ,
                //  maxAge: 24 * 60 * 60 * 1000, // 1 day
}) // Adjust `secure: true` for production
            .status(200)
            .json({ message: 'Login successful', user: userWithoutPassword });      
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


exports.logout = (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie('token', { httpOnly: true,sameSite:'None' })
            .json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid token.' });
            }

            // Find user by ID extracted from token
            const user = await User.findById(userData.id).select('-password'); // Exclude password from response

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Send user profile data in response
            res.json(user);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Controller for uploading avatar
exports.uploadAvatar = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const avatarUrl = path.join('uploads/events/', req.file.filename); // Path to the uploaded file
        res.status(200).json({ message: 'Avatar uploaded successfully', avatarUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading avatar', error: error.message });
    }
};
exports.updateProfile = async (req, res) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid token.' });
            }

            const userIdFromToken = userData.id; // Extract user ID from token
            const { id: profileId } = req.params; // Extract profile ID from request parameters

            // Check if the profile to update matches the user's ID
            if (userIdFromToken !== profileId) {
                return res.status(403).json({ message: 'You can only update your own profile.' });
            }

            // Validate and update profile
            const updatedData = req.body; // Get updated profile data from request body
            const allowedUpdates = ['name', 'email']; // Specify fields that can be updated
            const isValidUpdate = Object.keys(updatedData).every((key) => allowedUpdates.includes(key));

            if (!isValidUpdate) {
                return res.status(400).json({ message: 'Invalid updates!' });
            }

            // Find and update the user's profile
            const updatedUser = await User.findByIdAndUpdate(userIdFromToken, updatedData, {
                new: true,
                runValidators: true
            })

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Send updated profile data in response
            res.json({ message: 'Profile updated successfully.', user: updatedUser });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid token.' });
            }

            // Check if the user is an admin (Optional: Role-based access)
            const user = await User.findById(userData.id);
            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Only admins can view all users.' });
            }

            // Fetch all users excluding sensitive data like passwords
            const users = await User.find().select('-password');

            res.json({ message: 'Users fetched successfully.', users });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
