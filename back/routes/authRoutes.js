const express = require('express');
const { register, login,logout, getProfile, updateProfile, getAllUsers ,uploadAvatar} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout',verifyToken, logout);
router.get('/profile',verifyToken, getProfile);
// router.post('/upload-avatar', uploadAvatar);

router.put('/updateProfile/:id',verifyToken, updateProfile);
router.get('/getAllUser',verifyToken,checkRole('admin'), getAllUsers);


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
