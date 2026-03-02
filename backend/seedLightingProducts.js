const mongoose = require('mongoose');
require('dotenv').config();
const Business = require('./models/Business');
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected for seeding lighting products'))
    .catch(err => console.error('mongoDB connection error:', err));

const dummyProducts = [
    {
        productName: 'Smart LED Bulb 9W',
        category: 'Lighting & Electrical',
        brand: 'Philips',
        actualPrice: 850,
        sellingPrice: 650,
        stock: 500,
        minOrderQuantity: 10,
        description: 'Wi-Fi enabled smart LED bulb with 16 million colors.',
        specifications: {
            power: '9W',
            capType: 'B22',
            feature: 'App Control, Voice Control',
            warranty: '2 Years'
        },
        images: [],
        approvalStatus: 'pending'
    },
    {
        productName: 'Crystal Chandelier Modern',
        category: 'Lighting & Electrical',
        brand: 'Jaquar',
        actualPrice: 15000,
        sellingPrice: 12500,
        stock: 20,
        minOrderQuantity: 1,
        description: 'Elegant crystal chandelier for living and dining rooms.',
        specifications: {
            type: 'Ceiling Mounted',
            material: 'Crystal & Metal',
            lightSource: 'E14 Bulbs',
            dimensions: '600x600 mm'
        },
        images: [],
        approvalStatus: 'pending'
    },
    {
        productName: 'Modular Switch Board (8 Module)',
        category: 'Lighting & Electrical',
        brand: 'Havells',
        actualPrice: 850,
        sellingPrice: 600,
        stock: 200,
        minOrderQuantity: 5,
        description: 'Premium finish modular switch plate with anti-bacterial coating.',
        specifications: {
            modules: '8',
            color: 'White',
            material: 'Polycarbonate',
            series: 'Fabio'
        },
        images: [],
        approvalStatus: 'pending'
    },
    {
        productName: 'High Speed Ceiling Fan',
        category: 'Lighting & Electrical',
        brand: 'Crompton',
        actualPrice: 3200,
        sellingPrice: 2800,
        stock: 100,
        minOrderQuantity: 2,
        description: 'Energy efficient high speed ceiling fan with anti-dust technology.',
        specifications: {
            sweep: '1200mm',
            speed: '380 RPM',
            powerConsumption: '75W',
            color: 'Metallic Brown'
        },
        images: [],
        approvalStatus: 'pending'
    },
    {
        productName: 'LED Slim Panel Light 15W',
        category: 'Lighting & Electrical',
        brand: 'Syska',
        actualPrice: 550,
        sellingPrice: 420,
        stock: 300,
        minOrderQuantity: 10,
        description: 'Round slim panel light for false ceilings.',
        specifications: {
            power: '15W',
            shape: 'Round',
            cutoutSize: '6 inch',
            colorTemperature: '6500K (Cool Day Light)'
        },
        images: [],
        approvalStatus: 'pending'
    }
];

async function seedLightingProducts() {
    try {
        const business = await Business.findOne({ businessName: 'Bright Lights & Electricals' });

        if (!business) {
            console.error('❌ Business "Bright Lights & Electricals" not found!');
            process.exit(1);
        }

        console.log(`Found Business: ${business.businessName} (ID: ${business._id})`);

        // Add businessId to products
        const productsWithBusiness = dummyProducts.map(p => ({
            ...p,
            businessId: business._id
        }));

        await Product.insertMany(productsWithBusiness);
        console.log('✅ Successfully added 5 dummy products for Bright Lights & Electricals');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
}

seedLightingProducts();
