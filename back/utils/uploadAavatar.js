// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;

// // Configure Cloudinary Storage for avatars
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'user_avatars', // Specific folder for avatars
//         allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
//         transformation: [
//             { width: 200, height: 200, crop: 'fill' }, // Optional: resize avatar
//             { quality: 'auto' },
//             { fetch_format: 'auto' },
//         ],
//     },
// });

// // Configure multer
// const upload = multer({
//     storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for avatars
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
//         if (!allowedTypes.includes(file.mimetype)) {
//             return cb(new Error('Only JPEG, JPG, PNG, WEBP, and AVIF images are allowed'), false);
//         }
//         cb(null, true);
//     },a
// });

// module.exports = upload;



// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;
// const dotenv = require('dotenv');

// dotenv.config();

// // Configure Cloudinary
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Verify Cloudinary connection
// cloudinary.api.ping((error, result) => {
//     if (error) {
//         console.error('Cloudinary connection failed:', error);
//     } else {
//         console.log('Cloudinary connection successful:', result);
//     }
// });

// // Single Cloudinary storage for both avatar and docs
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: async (req, file) => {
//         console.log('Processing file:', file.fieldname, file.originalname);
//         if (file.fieldname === 'avatar') {
//             return {
//                 folder: 'user_avatars',
//                 allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
//                 transformation: [
//                     { width: 200, height: 200, crop: 'fill' },
//                     { quality: 'auto' },
//                     { fetch_format: 'auto' },
//                 ],
//             };
//         } else if (file.fieldname === 'docs') {
//             return {
//                 folder: 'vendor_docs',
//                 allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
//                 resource_type: 'auto',
//             };
//         }
//     },
// });

// const upload = multer({
//     storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB limit
//         files: 6, // Max 1 avatar + 5 docs
//     },
//     fileFilter: (req, file, cb) => {
//         console.log('File filter:', file.fieldname, file.mimetype);
//         const allowedTypes = {
//             avatar: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
//             docs: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
//         };
//         if (!allowedTypes[file.fieldname]?.includes(file.mimetype)) {
//             return cb(new Error(`Invalid file type for ${file.fieldname}`), false);
//         }
//         cb(null, true);
//     },
// }).fields([
//     { name: 'avatar', maxCount: 1 },
//     { name: 'docs', maxCount: 5 },
// ]);

// const uploadMiddleware = (req, res, next) => {
//     console.log('Incoming FormData fields:', Object.keys(req.body || {}));
//     upload(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             console.error('Multer error:', err);
//             return res.status(400).json({ message: 'File upload error', error: err.message });
//         } else if (err) {
//             console.error('Upload error:', err);
//             return res.status(400).json({ message: 'Error uploading files', error: err.message });
//         }
//         console.log('Multer processed - Body:', req.body, 'Files:', req.files);
//         next();
//     });
// };

// module.exports = uploadMiddleware;




const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');
const pdf = require('pdf-parse'); // For PDF validation

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify Cloudinary connection
cloudinary.api.ping((error, result) => {
    if (error) {
        console.error('Cloudinary connection failed:', error);
    } else {
        console.log('Cloudinary connection successful:', result);
    }
});

// Validate PDF file
const validatePdf = async (buffer) => {
    try {
        await pdf(buffer); // Attempt to parse the PDF
        return true;
    } catch (error) {
        console.error('Invalid PDF:', error);
        return false;
    }
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log('Processing file:', file.fieldname, file.originalname, file.mimetype);
        const extension = path.extname(file.originalname).toLowerCase().replace('.', '');
        const baseName = path.basename(file.originalname, `.${extension}`);
        if (file.fieldname === 'avatar') {
            return {
                folder: 'user_avatars',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
                format: extension,
                transformation: [
                    { width: 200, height: 200, crop: 'fill' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
                resource_type: 'image',
                public_id: `avatar_${Date.now()}_${baseName}`,
            };
        } else if (file.fieldname === 'docs') {
            const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype);
            if (!isImage && file.mimetype === 'application/pdf') {
                // Validate PDF
                const isValidPdf = await validatePdf(file.buffer);
                if (!isValidPdf) {
                    throw new Error('Uploaded file is not a valid PDF');
                }
            }
            return {
                folder: 'vendor_docs',
                allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
                format: isImage ? extension : 'pdf', // Force pdf format for PDFs
                resource_type: isImage ? 'image' : 'raw',
                transformation: isImage
                    ? [
                        { quality: 'auto' },
                        { fetch_format: 'auto' },
                    ]
                    : undefined,
                public_id: `doc_${Date.now()}_${baseName}`,
            };
        }
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 6, // Max 1 avatar + 5 docs
    },
    fileFilter: (req, file, cb) => {
        console.log('File filter:', file.fieldname, file.mimetype);
        const allowedTypes = {
            avatar: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
            docs: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
        };
        if (!allowedTypes[file.fieldname]?.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${allowedTypes[file.fieldname].join(', ')}`), false);
        }
        cb(null, true);
    },
}).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'docs', maxCount: 5 },
]);

const uploadMiddleware = (req, res, next) => {
    console.log('Incoming FormData fields:', Object.keys(req.body || {}));
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: 'File upload error', error: err.message });
        } else if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ message: 'Error uploading files', error: err.message });
        }
        console.log('Multer processed - Body:', req.body, 'Files:', req.files);
        if (req.files && req.files.docs) {
            req.files.docs.forEach((file) => {
                console.log('Uploaded file:', {
                    path: file.path,
                    mimetype: file.mimetype,
                    public_id: file.public_id,
                    format: file.format,
                });
            });
        }
        next();
    });
};

module.exports = uploadMiddleware;