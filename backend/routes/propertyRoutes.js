const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/properties';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `property-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// GET /api/properties - Get all properties
router.get('/', async (req, res) => {
    try {
        const { type, location } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (location) filter.location = new RegExp(location, 'i');

        const properties = await Property.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, properties });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ success: false, message: 'Server error fetching properties' });
    }
});

// POST /api/properties/list - List a new property with image upload
router.post('/list', upload.single('image'), async (req, res) => {
    try {
        const { title, type, price, location, area, description, sellerName, sellerPhone } = req.body;

        if (!title || !type || !price || !location || !area || !description || !sellerName || !sellerPhone) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/properties/${req.file.filename}`;
        }

        const newProperty = new Property({
            title,
            type,
            price: Number(price),
            location,
            area,
            description,
            images: imageUrl ? [imageUrl] : [],
            sellerName,
            sellerPhone
        });

        await newProperty.save();
        res.status(201).json({ success: true, message: 'Property listed successfully!' });
    } catch (error) {
        console.error('Error listing property:', error);
        res.status(500).json({ success: false, message: 'Server error listing property' });
    }
});

module.exports = router;
