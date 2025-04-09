const nodemailer = require('nodemailer');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../helpers/Send-Email')
const crypto = require('crypto');
const {deleteOldAvatar}=require('../utils/avatarUpdate')
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
        // Send Welcome Email
        await sendEmail(email, "Welcome to EMS!", "welcomeEmail", { name });
        
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


// Upload Avatar Handler
exports.uploadAvatar = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Get the secure URL from Cloudinary
        const avatarUrl = req.file.path; // Cloudinary returns the URL in path property

        // Find the user to get the old avatar URL (if any)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the old avatar from Cloudinary if it exists
        if (user.avatar) {
            await deleteOldAvatar(user.avatar);
        }

        // Update the user's avatar in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Avatar uploaded successfully',
            avatar: avatarUrl,
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({
            message: 'Error uploading avatar',
            error: error.message,
        });
    }
};
exports.updateProfile = async (req, res) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.token;
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
            // const allowedUpdates = ['name', 'email']; // Specify fields that can be updated
            // const isValidUpdate = Object.keys(updatedData).every((key) => allowedUpdates.includes(key));

            // if (!isValidUpdate) {
            //     return res.status(400).json({ message: 'Invalid updates!' });
            // }

            // Find and update the user's profile
            const updatedUser = await User.findByIdAndUpdate(userIdFromToken, updatedData, {
                new: true,
                runValidators: true
            })

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // **Send email notification after profile update**
            await sendEmail(
                updatedUser.email,
                "Profile Updated Successfully",
                "profileUpdate", // Email template name
                { name: updatedUser.name } // Replacements for template
            );


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




exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        return res.status(404).json({ message: 'User not found in...' });
    }

    // Generate a reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });  // Save the token and expiration time
    const BASE_URL =
        process.env.NODE_ENV === 'production'
            ? 'https://e-market-hbf7.onrender.com' // Production URL
            : 'http://localhost:3000'; // Local development URL
    // Create reset URL
    const resetUrl = `${BASE_URL}/reset-password/${resetToken}`;
 

    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'melakuazene623@gmail.com',
                pass: 'kjcsxivrsknrmkte'
            }
        });

        const mailOptions = {
            from: 'melakuazene623@gmail.com',
            to: user.email,
            subject: 'Password Reset Request',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #2c3e50; font-size: 24px;">Password Reset Request</h1>
            </div>
            <p style="font-size: 16px; color: #555;">
                Hello, you have requested to reset your password. Click the button below to reset your password. 
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${resetUrl}" style="background-color: #3498db; color: white; text-decoration: none; padding: 15px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #555;">
                If you did not request this password reset, please ignore this email.
            </p>
            <hr style="border: 0; height: 1px; background: #eaeaea;" />
            <footer style="text-align: center; font-size: 12px; color: #aaa; padding-top: 10px;">
                <p>&copy; ${new Date().getFullYear()} EventHUb. All rights reserved.</p>
                <p>Bahirdar,Ethiopia</p>
            </footer>
        </div>
    `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Check your Email ,we have sent with reset instructions' });
    } catch (error) {
        console.log('error sending email', error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500).json({ message: 'Error sending email', error });
    }
};





exports.resetPassword = async (req, res) => {
    const { token } = req.params; // This should be the un-hashed token from the URL
    const { password } = req.body;
    console.log("Received Token: ", token);

    // Hash the token and compare it with the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log("Hashed Token: ", hashedToken);
  
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }  // Check if token is not expired
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
};



// Delete User by ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(id);

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




// Update user role or status
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (role) user.role = role; // Update role if provided
        if (status) user.status = status; // Update status if provided

        await user.save();

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Follow an organizer
exports.followedOrganizers= async (req, res) => {
        const { userId, organizerId } = req.body;

        try {
            const user = await User.findById(userId);
            if (!user.followedOrganizers.includes(organizerId)) {
                user.followedOrganizers.push(organizerId);
                await user.save();
            }

            // Return the updated user object
            res.json(user);
        } catch (error) {
            console.error("Error following organizer:", error);
            console.log("error on folloing", error);
            res.status(500).send("Server error");
        }
}
exports.totalFollowerOfOrganizer = async (req, res) => {
    try {
        const organizerId = req.params.organizerId;

        // Count users who have the organizerId in their followedOrganizers array
        const followersCount = await User.countDocuments({ followedOrganizers: organizerId });

        res.status(200).json({ followers: followersCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};





// Google OAuth Callback Handler
exports.googleCallback = (req, res) => {
    console.log('Google response', req.query);
    const { code } = req.query;
    console.log('Authorization code', code);
    const token = req.user.token;
    console.log('Token from Google authenticated', token);

    // Store token in a cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Change to true in production (for HTTPS)
        sameSite: 'strict',
    });

    res.redirect('http://localhost:3000');
};

// Logout Handler
exports.logoutGoogle = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Error logging out.');
        }
        res.clearCookie('token');
        res.redirect('http://localhost:3000');
    });
};

