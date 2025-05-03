const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Event = require('../models/Event');
const  verifyToken  = require('../middlewares/verifyToken'); // Assuming you have auth middleware
const checkRole= require('../middlewares/checkRole'); // Assuming you have role checking middleware
// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new category (Admin only)
router.post('/', verifyToken, async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }
    try {
        const existingCategory = await Category.findOne({ name: name.toLowerCase() });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a category (Admin only)
router.put('/:id', verifyToken, async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const existingCategory = await Category.findOne({ name: name.toLowerCase(), _id: { $ne: req.params.id } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        category.name = name.toLowerCase();
        category.description = description;
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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
        await Category.deleteOne({ _id: req.params.id });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;