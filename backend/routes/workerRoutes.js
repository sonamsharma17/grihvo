const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const jwt = require('jsonwebtoken');

// POST /api/workers/register
router.post('/register', async (req, res) => {
    try {
        const { type, category, name, phone, password, address, aadhar, age } = req.body;

        // Validation
        if (!type || !name || !phone || !password || !address || !aadhar || !age) {
            return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
        }

        if (type === 'Professional' && !category) {
            return res.status(400).json({ success: false, message: 'Please select a category for Professional.' });
        }

        // Check if worker already exists
        const existingWorker = await Worker.findOne({ phone });
        if (existingWorker) {
            return res.status(400).json({ success: false, message: 'Worker with this phone number already exists.' });
        }

        const newWorker = new Worker({
            type,
            category: type === 'Professional' ? category : undefined, // Only save category for professionals
            name,
            phone,
            password,
            address,
            aadhar,
            age
        });

        await newWorker.save();

        res.status(201).json({ success: true, message: 'Registered successfully!' });
    } catch (error) {
        console.error('Error registering worker:', error);
        res.status(500).json({ success: false, message: 'Server error inside worker registration.' });
    }
});

// POST /api/workers/login
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ success: false, message: 'Please provide phone and password.' });
        }

        const worker = await Worker.findOne({ phone });
        if (!worker) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const isMatch = await worker.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: worker._id, role: 'worker' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            worker: {
                id: worker._id,
                name: worker.name,
                type: worker.type,
                category: worker.category
            }
        });
    } catch (error) {
        console.error('Error in worker login:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/workers - Get all workers
router.get('/', async (req, res) => {
    try {
        const { type, category, address } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (address) filter.address = address;

        const workers = await Worker.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, workers });
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).json({ success: false, message: 'Server error fetching workers.' });
    }
});

// GET /api/workers/locations - Get unique locations from workers
router.get('/locations', async (req, res) => {
    try {
        const locations = await Worker.distinct('address');
        // Optionally, simplify locations if they are long addresses
        // For now, returning unique addresses as they are often used as locations in this context
        res.json({ success: true, locations });
    } catch (error) {
        console.error('Error fetching worker locations:', error);
        res.status(500).json({ success: false, message: 'Server error fetching locations.' });
    }
});

// GET /api/workers/categories - Get unique categories from workers (mostly professionals)
router.get('/categories', async (req, res) => {
    try {
        const { location } = req.query;
        const filter = { category: { $ne: null } };
        if (location) {
            filter.address = location;
        }

        const categories = await Worker.distinct('category', filter);
        res.json({ success: true, categories });
    } catch (error) {
        console.error('Error fetching worker categories:', error);
        res.status(500).json({ success: false, message: 'Server error fetching categories.' });
    }
});

module.exports = router;
