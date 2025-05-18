// const express = require('express');
// const router = express.Router();
// const Category = require('../models/Category');
// const Event = require('../models/Event');
// const  verifyToken  = require('../middlewares/verifyToken'); // Assuming you have auth middleware
// const checkRole= require('../middlewares/checkRole'); // Assuming you have role checking middleware
// // Get all categories
// router.get('/', async (req, res) => {
//     try {
//         const categories = await Category.find().sort({ name: 1 });
//         res.json(categories);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Create a new category (Admin only)
// router.post('/', verifyToken, async (req, res) => {
//     const { name, description } = req.body;
//     if (!name) {
//         return res.status(400).json({ message: 'Category name is required' });
//     }
//     try {
//         const existingCategory = await Category.findOne({ name: name.toLowerCase() });
//         if (existingCategory) {
//             return res.status(400).json({ message: 'Category already exists' });
//         }
//         const category = new Category({ name, description });
//         await category.save();
//         res.status(201).json(category);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Update a category (Admin only)
// router.put('/:id', verifyToken, async (req, res) => {
//     const { name, description } = req.body;
//     if (!name) {
//         return res.status(400).json({ message: 'Category name is required' });
//     }
//     try {
//         const category = await Category.findById(req.params.id);
//         if (!category) {
//             return res.status(404).json({ message: 'Category not found' });
//         }
//         const existingCategory = await Category.findOne({ name: name.toLowerCase(), _id: { $ne: req.params.id } });
//         if (existingCategory) {
//             return res.status(400).json({ message: 'Category name already exists' });
//         }
//         category.name = name.toLowerCase();
//         category.description = description;
//         await category.save();
//         res.json(category);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Delete a category (Admin only)
// router.delete('/:id', verifyToken, async (req, res) => {
//     try {
//         const category = await Category.findById(req.params.id);
//         if (!category) {
//             return res.status(404).json({ message: 'Category not found' });
//         }
//         // Check if category is used by any events
//         const eventCount = await Event.countDocuments({ category: req.params.id });
//         if (eventCount > 0) {
//             return res.status(400).json({ message: 'Cannot delete category used by events' });
//         }
//         await Category.deleteOne({ _id: req.params.id });
//         res.json({ message: 'Category deleted' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Event = require('../models/Event');
const verifyToken = require('../middlewares/verifyToken');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const uploadMiddleware = require('../utils/uploadAavatar');
// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get events by category
router.get('/events', async (req, res) => {
    try {
        const categoryId = req.query.category;
        // Validate category ID
        if (!mongoose.isValidObjectId(categoryId)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Fetch events
        const events = await Event.find({ category: categoryId }).populate('category');
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        // Validate category ID
        if (!mongoose.isValidObjectId(categoryId)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Create a new category (Admin only)
router.post('/', verifyToken, uploadMiddleware, async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }
    try {
        const existingCategory = await Category.findOne({ name: name.toLowerCase() });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const categoryData = { name: name.toLowerCase(), description };

        // Handle icon upload
        if (req.files && req.files.avatar && req.files.avatar.length > 0) {
            categoryData.icon = {
                url: req.files.avatar[0].path,
                public_id: req.files.avatar[0].public_id
            };
        }

        const category = new Category(categoryData);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update a category (Admin only)
router.put('/:id', verifyToken, uploadMiddleware, async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update name only if provided and not already taken
        if (name) {
            const existingCategory = await Category.findOne({
                name: name.toLowerCase(),
                _id: { $ne: req.params.id }
            });
            if (existingCategory) {
                return res.status(400).json({ message: 'Category name already exists' });
            }
            category.name = name.toLowerCase();
        }

        // Update description if provided
        if (description !== undefined) {
            category.description = description;
        }

        // Handle icon update
        if (req.files && req.files.avatar && req.files.avatar.length > 0) {
            // Delete old icon from Cloudinary if it exists
            if (category.icon && category.icon.public_id) {
                await cloudinary.uploader.destroy(category.icon.public_id);
            }
            // Set new icon
            category.icon = {
                url: req.files.avatar[0].path,
                public_id: req.files.avatar[0].public_id
            };
        }

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a category (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if category is used by any events
        const eventCount = await Event.countDocuments({ category: req.params.id });
        if (eventCount > 0) {
            return res.status(400).json({ message: 'Cannot delete category used by events' });
        }

        // Delete icon from Cloudinary if it exists
        if (category.icon && category.icon.public_id) {
            await cloudinary.uploader.destroy(category.icon.public_id);
        }

        await Category.deleteOne({ _id: req.params.id });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;