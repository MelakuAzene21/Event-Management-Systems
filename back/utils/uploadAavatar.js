const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary Storage for avatars
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_avatars', // Specific folder for avatars
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        transformation: [
            { width: 200, height: 200, crop: 'fill' }, // Optional: resize avatar
            { quality: 'auto' },
            { fetch_format: 'auto' },
        ],
    },
});

// Configure multer
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for avatars
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, JPG, PNG, WEBP, and AVIF images are allowed'), false);
        }
        cb(null, true);
    },
});

module.exports = upload;