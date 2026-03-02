const mongoose = require('mongoose');
require('dotenv').config();
const Business = require('./models/Business');
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected for seeding furniture products'))
    .catch(err => console.error('mongoDB connection error:', err));

const dummyProducts = [
    {
        productName: 'Premium Teak Plywood 18mm',
        category: 'Furniture & Wood Materials',
        brand: 'Greenply',
        actualPrice: 150,
        sellingPrice: 130,
        stock: 500,
        minOrderQuantity: 10,
        description: 'Waterproof and termite-resistant marine grade plywood.',
        specifications: {
            thickness: '18mm',
            grade: 'BWP (Boiling Water Proof)',
            size: '8x4 feet',
            core: 'Gurjan'
        },
        images: [],
        approvalStatus: 'pending'
    },
    {
        productName: 'Decorative Laminate Sheet (Wood Finish)',
        category: 'Furniture & Wood Materials',
        brand: 'Merino',
        actualPrice: 2200,
        sellingPrice: 1850,
        stock: 300,
        minOrderQuantity: 5,
        description: 'Matte finish wood grain laminate for furniture surfacing.',
        specifications: {
            thickness: '1mm',
            size: '8x4 feet',
            finish: 'Suede/Matte',
            design: 'Walnut Oak'
        },
        images: [],
        approvalStatus: 'pending'
    },
    {
        productName: 'Soft Close Drawer Channels (Pair)',
        category: 'Furniture & Wood Materials',
        brand: 'Hettich',
        actualPrice: 850,
        sellingPrice: 720,
        stock: 200,
        minOrderQuantity: 10,
        description: 'Premium telescopic drawer slides with soft closing mechanism.',
        specifications: {
            length: '20 inch (500mm)',
            loadCapacity: '45kg',
            material: 'Zinc Plated Steel',
            feature: 'Silent System'
        },
        images: [],
        approvalStatus: 'pending'
    },
    {
        productName: 'Commercial Flush Door',
        category: 'Furniture & Wood Materials',
        brand: 'Century',
        actualPrice: 4500,
        sellingPrice: 3800,
        stock: 50,
        minOrderQuantity: 2,
        description: 'Ready-to-use pine wood filled flush door for interiors.',
        specifications: {
            height: '7 feet',
            width: '3 feet',
            thickness: '30mm',
            treatment: 'Chemically Treated'
        },
        images: [],
        approvalStatus: 'pending'
    },
    {
        productName: 'Hydraulic Bed Lift Mechanism',
        category: 'Furniture & Wood Materials',
        brand: 'Ebco',
        actualPrice: 3500,
        sellingPrice: 2900,
        stock: 100,
        minOrderQuantity: 1,
        description: 'Heavy duty hydraulic pump set for storage beds.',
        specifications: {
            capacity: '150kg',
            length: '1500mm',
            compatibility: 'King/Queen Size Beds',
            warranty: '1 Year'
        },
        images: [],
        approvalStatus: 'pending'
    }
];

async function seedFurnitureProducts() {
    try {
        const business = await Business.findOne({ businessName: 'Woodcraft Furniture Materials' });

        if (!business) {
            console.error('❌ Business "Woodcraft Furniture Materials" not found!');
            process.exit(1);
        }

        console.log(`Found Business: ${business.businessName} (ID: ${business._id})`);

        // Add businessId to products
        const productsWithBusiness = dummyProducts.map(p => ({
            ...p,
            businessId: business._id
        }));

        await Product.insertMany(productsWithBusiness);
        console.log('✅ Successfully added 5 dummy products for Woodcraft Furniture Materials');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
}

seedFurnitureProducts();
