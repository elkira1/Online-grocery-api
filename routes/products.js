const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../routes/verifyToken');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new product (Admin only)
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        description: req.body.description,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a product (Admin only)
router.patch('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }

        if (req.body.name != null) {
            product.name = req.body.name;
        }
        if (req.body.price != null) {
            product.price = req.body.price;
        }
        if (req.body.category != null) {
            product.category = req.body.category;
        }
        if (req.body.stock != null) {
            product.stock = req.body.stock;
        }
        if (req.body.description != null) {
            product.description = req.body.description;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a product (Admin only)
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
