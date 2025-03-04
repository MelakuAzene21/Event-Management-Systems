const express = require('express');
const { register, login,logout, getProfile, updateProfile, getAllUsers ,deleteUser,uploadAvatar,forgotPassword,resetPassword, updateUser} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const router = express.Router();
const passport = require("passport");

require("../config/passport");
router.post('/register', register);
router.post('/login', login);
router.post('/logout',verifyToken, logout);
router.get('/profile',verifyToken, getProfile);
// router.post('/upload-avatar', uploadAvatar);

router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);


// Google OAuth Login
router.get("/google", passport.authenticate("google",

    { scope: ["profile", "email"] ,
    prompt: 'select_account consent' , // Forces Google to show account selection and persmission dialog
    accessType: 'offline' ,// Enables refresh token
    authtype:'reauthenticate'  }));

// Google OAuth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
    (req, res) => {

        console.log("Google response",req.query);
const{code}=req.query;
console.log("Authorization code",code);
        const token = req.user.token;
        console.log("Token from google authenticated",token);
        // Store token in a cookie
        res.cookie("token", req.user.token, {
            httpOnly: true,
            secure: false, // Change to true in production (for HTTPS)
            sameSite: "strict",
        });
        res.redirect("http://localhost:3000");
    }
);



// Logout Route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send("Error logging out.");
        res.clearCookie("token");
        res.redirect("http://localhost:3000");
    });
});


router.delete("/users/:id", verifyToken, checkRole('admin'), deleteUser);
router.put("/users/:id", verifyToken, checkRole('admin'), updateUser);


router.put('/updateProfile/:id',verifyToken, updateProfile);
router.get('/getAllUser',verifyToken,checkRole('admin'), getAllUsers);
// router.get('/getAllUser',  getAllUsers);


const multer = require('multer');
const User = require('../models/User'); // Adjust the path to your user model

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    },
});
const upload = multer({ storage });
router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        const userId = req.user.id;
        const avatarPath = req.file.path.replace(/\\/g, '/'); // Normalize file path
        const avatarUrl = `${req.protocol}://${req.get('host')}/${avatarPath}`; // Generate full URL

        // Update the user's avatar in the database
        await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });

        res.status(200).json({ message: 'Avatar uploaded successfully', avatar: avatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading avatar' });
    }
});





module.exports = router;
