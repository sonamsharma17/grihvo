const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const Business = require('../models/Business');
const User = require('../models/User');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'idproof-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only JPG, PNG, and PDF files are allowed'));
        }
    }
});

// POST /api/business/register
router.post('/register', upload.single('idProof'), async (req, res) => {
    try {
        // Parse JSON fields
        const categories = req.body.categories ? JSON.parse(req.body.categories) : [];
        const workingDays = req.body.workingDays ? JSON.parse(req.body.workingDays) : [];
        const brands = req.body.brands ? JSON.parse(req.body.brands) : {};
        const priceRanges = req.body.priceRanges ? JSON.parse(req.body.priceRanges) : {};
        const stockLevels = req.body.stockLevels ? JSON.parse(req.body.stockLevels) : {};
        const coordinates = req.body.coordinates ? JSON.parse(req.body.coordinates) : { lat: 0, lng: 0 };

        // Create new business
        const newBusiness = new Business({
            // Step 1: Basic Details
            businessName: req.body.businessName,
            ownerName: req.body.ownerName,
            mobile: req.body.mobile,
            email: req.body.email,
            businessCategory: req.body.businessCategory,

            // Step 2: Location
            address: req.body.address,
            city: req.body.city,
            pincode: req.body.pincode,
            coordinates: coordinates,
            serviceRadius: req.body.serviceRadius,
            landmark: req.body.landmark,

            // Step 3: Capacity
            serviceType: req.body.serviceType,
            dailyCapacity: req.body.dailyCapacity,
            minOrderValue: req.body.minOrderValue,
            deliveryAvailable: req.body.deliveryAvailable === 'true',
            deliveryCharge: req.body.deliveryCharge,

            // Step 4: Products
            categories: categories,
            brands: brands,
            priceRanges: priceRanges,
            stockLevels: stockLevels,

            // Step 5: Legal
            gstNumber: req.body.gstNumber,
            shopLicense: req.body.shopLicense,
            panCard: req.body.panCard,
            idProof: req.file ? req.file.path : null,

            // Step 6: Working Hours
            workingDays: workingDays,
            openTime: req.body.openTime,
            closeTime: req.body.closeTime,
            emergencyOrders: req.body.emergencyOrders === 'true',

            // Step 7: Payment
            accountNumber: req.body.accountNumber,
            ifsc: req.body.ifsc,
            accountHolder: req.body.accountHolder,
            payoutCycle: req.body.payoutCycle,

            // Authentication - hash password before saving
            password: req.body.password ? await bcrypt.hash(req.body.password, 10) : null,

            status: 'pending'
        });

        // Save to database
        const savedBusiness = await newBusiness.save();

        res.status(201).json({
            success: true,
            message: 'Business registration submitted successfully',
            businessId: savedBusiness._id,
            status: savedBusiness.status
        });

    } catch (error) {
        console.error('Error registering business:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register business',
            error: error.message
        });
    }
});

// GET /api/business/:id - Get business by ID
router.get('/:id', async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }
        res.json({ success: true, business });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/business - Get all businesses
router.get('/', async (req, res) => {
    try {
        const businesses = await Business.find().sort({ createdAt: -1 });
        res.json({ success: true, count: businesses.length, businesses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PATCH /api/business/:id/status - Update business status (approve/reject)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const businessId = req.params.id;

        // Validate status
        if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "approved", "rejected", or "pending"'
            });
        }

        // Find and update business
        const business = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found' });
        }

        business.status = status;

        // Add rejection reason if status is rejected
        if (status === 'rejected' && rejectionReason) {
            business.rejectionReason = rejectionReason;
        }

        // If approved, create user account with admin role
        if (status === 'approved' && !business.userId) {
            try {
                // Check if user already exists with this email
                const existingUser = await User.findOne({ email: business.email });

                if (!existingUser) {
                    // Create new admin user
                    const newUser = new User({
                        name: business.ownerName,
                        email: business.email,
                        phone: business.mobile,
                        password: business.password, // Already hashed
                        role: 'admin'
                    });

                    // Skip password hashing in User model since it's already hashed
                    await newUser.save({ validateBeforeSave: false });

                    // Link user to business
                    business.userId = newUser._id;

                    console.log(`✅ Created admin user for business: ${business.businessName}`);
                } else {
                    // Link existing user to business
                    business.userId = existingUser._id;
                    console.log(`ℹ️  User already exists, linked to business: ${business.businessName}`);
                }
            } catch (userError) {
                console.error('Error creating user account:', userError);
                // Continue with business approval even if user creation fails
            }
        }

        await business.save();

        res.json({
            success: true,
            message: `Business ${status} successfully`,
            business
        });

    } catch (error) {
        console.error('Error updating business status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update business status',
            error: error.message
        });
    }
});

module.exports = router;
