const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

// Create New category
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newCategory = new Category(req.body);

    try {
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All categories
router.get('/', verifyToken, async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get One category by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a catégorie
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a categorie
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
