const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { authenticate } = require('../middleware/authMiddleware');

// @route   GET /api/cart
// @desc    Get current user's cart
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

        if (!cart) {
            cart = new Cart({ userId: req.userId, items: [] });
            await cart.save();
        }

        res.json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching cart'
        });
    }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', authenticate, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        let cart = await Cart.findOne({ userId: req.userId });

        if (!cart) {
            cart = new Cart({
                userId: req.userId,
                items: [{ productId, quantity }]
            });
        } else {
            // Check if product already exists in cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        await cart.populate('items.productId');

        res.json({
            success: true,
            message: 'Item added to cart',
            cart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error adding to cart'
        });
    }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:productId', authenticate, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
        await cart.save();
        await cart.populate('items.productId');

        res.json({
            success: true,
            message: 'Item removed from cart',
            cart
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error removing item'
        });
    }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity
// @access  Private
router.put('/update', authenticate, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        const cart = await Cart.findOne({ userId: req.userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.productId');

        res.json({
            success: true,
            message: 'Cart updated',
            cart
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating cart'
        });
    }
});

module.exports = router;
