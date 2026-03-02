
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Business = require('../models/Business');
const { authenticate } = require('../middleware/authMiddleware');

// Middleware to check if user is superadmin
const isSuperAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.role === 'superadmin') {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'Access denied. Super Admin only.'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error checking superadmin status'
        });
    }
};

// GET /api/super-admin/stats
router.get('/stats', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVendors = await User.countDocuments({ role: 'admin' });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const pendingApprovals = await Business.countDocuments({ status: 'pending' });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalVendors,
                totalProducts,
                totalOrders,
                pendingApprovals
            }
        });
    } catch (error) {
        console.error('Error fetching super admin stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// GET /api/super-admin/recent-users
router.get('/recent-users', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching recent users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent users'
        });
    }
});

// GET /api/super-admin/recent-businesses
router.get('/recent-businesses', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const businesses = await Business.find()
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({
            success: true,
            businesses
        });
    } catch (error) {
        console.error('Error fetching recent businesses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent businesses'
        });
    }
});

// GET /api/super-admin/users
router.get('/users', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'consumer' }) // Fetch only customers (consumers)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// POST /api/super-admin/users
router.post('/users', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this phone number already exists'
            });
        }

        // Create new user (password hashing is handled by User model pre-save hook)
        const user = new User({
            name,
            email: email || undefined,
            phone,
            password
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create user'
        });
    }
});

module.exports = router;
