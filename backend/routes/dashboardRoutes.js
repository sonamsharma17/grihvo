const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Business = require('../models/Business');
const { authenticate, isVendor } = require('../middleware/authMiddleware');

// GET /api/dashboard/stats - Get vendor dashboard statistics
router.get('/stats', authenticate, isVendor, async (req, res) => {
    try {
        // Find vendor's business
        const business = await Business.findOne({ userId: req.userId });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found for this vendor'
            });
        }

        // Get statistics
        const totalProducts = await Product.countDocuments({ businessId: business._id });
        const activeProducts = await Product.countDocuments({ businessId: business._id, isActive: true });
        const lowStockProducts = await Product.countDocuments({
            businessId: business._id,
            stock: { $lt: 10 },
            isActive: true
        });

        const totalOrders = await Order.countDocuments({ businessId: business._id });
        const pendingOrders = await Order.countDocuments({
            businessId: business._id,
            status: 'pending'
        });

        // Calculate total revenue
        const revenueData = await Order.aggregate([
            { $match: { businessId: business._id, status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        res.json({
            success: true,
            stats: {
                totalProducts,
                activeProducts,
                lowStockProducts,
                totalOrders,
                pendingOrders,
                totalRevenue
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

// GET /api/dashboard/recent-orders - Get recent orders
router.get('/recent-orders', authenticate, isVendor, async (req, res) => {
    try {
        // Find vendor's business
        const business = await Business.findOne({ userId: req.userId });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found for this vendor'
            });
        }

        const limit = parseInt(req.query.limit) || 10;

        // Get recent orders
        const orders = await Order.find({ businessId: business._id })
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent orders',
            error: error.message
        });
    }
});

// GET /api/dashboard/stock-alerts - Get low stock products
router.get('/stock-alerts', authenticate, isVendor, async (req, res) => {
    try {
        // Find vendor's business
        const business = await Business.findOne({ userId: req.userId });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found for this vendor'
            });
        }

        const threshold = parseInt(req.query.threshold) || 10;

        // Get low stock products
        const lowStockProducts = await Product.find({
            businessId: business._id,
            stock: { $lt: threshold },
            isActive: true
        }).sort({ stock: 1 });

        res.json({
            success: true,
            products: lowStockProducts,
            count: lowStockProducts.length
        });

    } catch (error) {
        console.error('Error fetching stock alerts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stock alerts',
            error: error.message
        });
    }
});

module.exports = router;
