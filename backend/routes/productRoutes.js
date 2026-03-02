const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Product = require('../models/Product');
const Business = require('../models/Business');
const { authenticate, isVendor, isSuperAdmin } = require('../middleware/authMiddleware');

// Ensure upload directory exists
const uploadDir = 'uploads/products/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for memory storage (processing with sharp)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit before processing
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
        }
    }
});

// Helper function to process and save images
const processImages = async (files) => {
    const processedPaths = [];
    for (const file of files) {
        const filename = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
        const filepath = path.join(uploadDir, filename);

        await sharp(file.buffer)
            .resize(800, 800, { // Resize to max 800x800, preserving aspect ratio
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 }) // Convert to WebP with 80% quality
            .toFile(filepath);

        processedPaths.push(filepath.replace(/\\/g, '/')); // Normalize path separators
    }
    return processedPaths;
};

// POST /api/products - Add new product
router.post('/', authenticate, isVendor, upload.array('images', 5), async (req, res) => {
    try {
        // Find vendor's business
        const business = await Business.findOne({ userId: req.userId });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found for this vendor'
            });
        }

        // Parse specifications if it's a string
        let specifications = {};
        if (req.body.specifications) {
            try {
                specifications = typeof req.body.specifications === 'string'
                    ? JSON.parse(req.body.specifications)
                    : req.body.specifications;
            } catch (e) {
                console.error('Error parsing specifications:', e);
                // Fallback or ignore
            }
        }

        // Process images
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = await processImages(req.files);
        }

        // Create new product
        const newProduct = new Product({
            productName: req.body.productName,
            images: imagePaths,
            category: req.body.category,
            brand: req.body.brand,
            actualPrice: req.body.actualPrice ? parseFloat(req.body.actualPrice) : undefined,
            sellingPrice: req.body.sellingPrice ? parseFloat(req.body.sellingPrice) : undefined,
            stock: req.body.stock ? parseInt(req.body.stock) : undefined,
            minOrderQuantity: req.body.minOrderQuantity ? parseInt(req.body.minOrderQuantity) : 1,
            description: req.body.description,
            longDescription: req.body.longDescription,
            unitType: req.body.unitType,
            usage: req.body.usage ? JSON.parse(req.body.usage) : [],
            isWaterResistant: req.body.isWaterResistant !== undefined ? req.body.isWaterResistant === 'true' : undefined,
            isFireResistant: req.body.isFireResistant !== undefined ? req.body.isFireResistant === 'true' : undefined,
            durabilityYears: req.body.durabilityYears ? parseInt(req.body.durabilityYears) : undefined,
            certifications: req.body.certifications ? JSON.parse(req.body.certifications) : [],
            warranty: req.body.warranty,
            manufacturingDate: req.body.manufacturingDate ? new Date(req.body.manufacturingDate) : undefined,
            specifications: specifications,
            businessId: business._id,
            approvalStatus: 'pending' // Explicitly set to pending for super admin approval
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product: savedProduct
        });

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add product',
            error: error.message
        });
    }
});

// GET /api/products - Get all approved products (Public)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {
            isActive: true, // Only show active products
            approvalStatus: 'approved' // Only show approved products
        };

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('businessId', 'businessName city');

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching public products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
});

// GET /api/products/admin/pending - Get pending products (Super Admin)
router.get('/admin/pending', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const products = await Product.find({ approvalStatus: 'pending' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('businessId', 'businessName ownerName email phone');

        const total = await Product.countDocuments({ approvalStatus: 'pending' });

        res.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching pending products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending products',
            error: error.message
        });
    }
});

// PATCH /api/products/:id/status - Approve/Reject product (Super Admin)
router.patch('/:id/status', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved or rejected.'
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { approvalStatus: status },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: `Product ${status} successfully`,
            product
        });

    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product status',
            error: error.message
        });
    }
});

// GET /api/products/my-products - Get vendor's products
router.get('/my-products', authenticate, isVendor, async (req, res) => {
    try {
        // Find vendor's business
        const business = await Business.findOne({ userId: req.userId });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found for this vendor'
            });
        }

        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Get filter parameters
        const filter = { businessId: business._id };
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }

        // Get products
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
});

// PUT /api/products/:id - Update product
router.put('/:id', authenticate, isVendor, upload.array('images', 5), async (req, res) => {
    console.log(`[Product Update] Request to update product ${req.params.id}`);
    console.log('[Product Update] Body:', req.body);
    console.log('[Product Update] Files:', req.files ? req.files.length : 'No files');

    try {
        // Find product
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Verify ownership
        const business = await Business.findOne({ userId: req.userId });
        if (!business || product.businessId.toString() !== business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this product'
            });
        }

        // Update fields
        if (req.body.productName) product.productName = req.body.productName;
        if (req.body.category) product.category = req.body.category;
        if (req.body.brand) product.brand = req.body.brand;
        if (req.body.actualPrice) product.actualPrice = parseFloat(req.body.actualPrice);
        if (req.body.sellingPrice) product.sellingPrice = parseFloat(req.body.sellingPrice);
        if (req.body.stock !== undefined) product.stock = parseInt(req.body.stock);
        if (req.body.minOrderQuantity) product.minOrderQuantity = parseInt(req.body.minOrderQuantity);

        // Update specifications
        if (req.body.specifications) {
            try {
                product.specifications = typeof req.body.specifications === 'string'
                    ? JSON.parse(req.body.specifications)
                    : req.body.specifications;
            } catch (e) {
                console.error('Error parsing specifications:', e);
            }
        }

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImagePaths = await processImages(req.files);
            product.images = [...product.images, ...newImagePaths].slice(0, 5); // Max 5 images
        }

        // Handle image deletions if specified (e.g., passed as 'deleteImages' array of indices or urls)
        // Reset approval status on update
        product.approvalStatus = 'pending';

        const updatedProduct = await product.save();

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', authenticate, isVendor, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Verify ownership
        const business = await Business.findOne({ userId: req.userId });
        if (!business || product.businessId.toString() !== business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this product'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
});

// PATCH /api/products/:id/toggle - Toggle product active status
router.patch('/:id/toggle', authenticate, isVendor, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Verify ownership
        const business = await Business.findOne({ userId: req.userId });
        if (!business || product.businessId.toString() !== business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to modify this product'
            });
        }

        product.isActive = !product.isActive;
        await product.save();

        res.json({
            success: true,
            message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
            product
        });

    } catch (error) {
        console.error('Error toggling product status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle product status',
            error: error.message
        });
    }
});

module.exports = router;
