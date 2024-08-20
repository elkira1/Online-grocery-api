const express = require('express');
const Order = require('../models/Orders');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../routes/verifyToken');
const router = express.Router();

// Add new Order
router.post('/', async (req, res) => {
    try {
        const { customerId, deliveryAddress, products, totalPrice, status } = req.body;

    
        if (!customerId || !deliveryAddress || !products || !totalPrice) {
            return res.status(400).json({ error: 'customerId, deliveryAddress, products, and totalPrice are required' });
        }

        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'products must be an array' });
        }

        const calculatedTotalPrice = products.reduce((total, item) => {
            if (!item.price || !item.quantity) {
                throw new Error('Each item must have a price and quantity');
            }
            return total + item.price * item.quantity;
        }, 0);

        if (calculatedTotalPrice !== totalPrice) {
            return res.status(400).json({ error: 'Total price does not match the calculated total price' });
        }

        
        const validStatuses = ['Pending', 'Completed', 'Cancelled'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const order = new Order({
            customerId,
            deliveryAddress,
            products,
            totalPrice,
            status
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get All Orders
router.get('/orders',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get one Order
router.get('/orders/:orderId',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a Order
router.put('/orders/:orderId',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Cancelled a order
router.delete('/orders/:orderId',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order cancelled' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Get Order Status
router.get('/orders/:orderId/status',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ status: order.status });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// payment management
router.post('/orders/:orderId/payment',verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Simulate payment processing
        order.paymentStatus = 'completed';
        await order.save();
        
        res.status(200).json({ message: 'Payment completed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
