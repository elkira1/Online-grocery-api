const express = require('express');
const Review = require('../models/Review');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../routes/verifyToken');
const router = express.Router();

// Create a review
router.post('/', async (req, res) => {
    try {
        const review = new Review(req.body);
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get All review about a product
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get one review
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a Review
router.put('/:id',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a review
router.delete('/:id',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
