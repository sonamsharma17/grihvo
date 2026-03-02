const mongoose = require('mongoose');
require('dotenv').config();
const Business = require('./models/Business');
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected for seeding sanitary products'))
    .catch(err => console.error('mongoDB connection error:', err));

// Using placeholder images for demo purposes
const dummyProducts = [
    {
        productName: 'Single Lever Basin Mixer (Chrome)',
        category: 'Sanitary & Bathroom Fittings',
        brand: 'Jaquar',
        actualPrice: 3500,
        sellingPrice: 2950,
        stock: 50,
        minOrderQuantity: 1,
        description: 'Modern design basin mixer with smooth single lever operation.',
        specifications: {
            finish: 'Chrome Plated',
            warranty: '10 Years',
            type: 'Deck Mounted',
            series: 'Kubix Prime'
        },
        images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'],
        approvalStatus: 'pending'
    },
    {
        productName: 'Wall Hung Toilet Seat (Rimless)',
        category: 'Sanitary & Bathroom Fittings',
        brand: 'Hindware',
        actualPrice: 12000,
        sellingPrice: 8500,
        stock: 30,
        minOrderQuantity: 1,
        description: 'Hygienic rimless design wall mounted commode with soft close seat cover.',
        specifications: {
            color: 'Starwhite',
            material: 'Ceramic',
            trapType: 'P-Trap',
            flushing: 'Dual Flush Compatible'
        },
        images: ['https://images.unsplash.com/photo-1564540586988-aa4e53c3d003?auto=format&fit=crop&q=80&w=800'],
        approvalStatus: 'pending'
    },
    {
        productName: 'Overhead Rain Shower 8"',
        category: 'Sanitary & Bathroom Fittings',
        brand: 'Kohler',
        actualPrice: 4500,
        sellingPrice: 3800,
        stock: 100,
        minOrderQuantity: 1,
        description: 'Luxurious 8-inch square rain shower for a spa-like experience.',
        specifications: {
            shape: 'Square',
            material: 'Brass',
            finish: 'Polished Chrome',
            flowRate: '2.5 GPM'
        },
        images: ['https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=800'],
        approvalStatus: 'pending'
    },
    {
        productName: 'Table Top Wash Basin (Oval)',
        category: 'Sanitary & Bathroom Fittings',
        brand: 'Cera',
        actualPrice: 3200,
        sellingPrice: 2600,
        stock: 45,
        minOrderQuantity: 1,
        description: 'Elegant oval shape table top wash basin for modern bathrooms.',
        specifications: {
            color: 'White',
            size: '550x380 mm',
            installation: 'Counter Top',
            material: 'Vitreous China'
        },
        images: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800'],
        approvalStatus: 'pending'
    },
    {
        productName: 'Stainless Steel Towel Rack (24")',
        category: 'Sanitary & Bathroom Fittings',
        brand: 'Parryware',
        actualPrice: 1800,
        sellingPrice: 1450,
        stock: 80,
        minOrderQuantity: 5,
        description: 'Rust-proof stainless steel double towel rack shelf.',
        specifications: {
            material: 'Stainless Steel 304',
            finish: 'Mirror Polish',
            mounting: 'Wall Mounted',
            length: '24 inches'
        },
        images: ['https://images.unsplash.com/photo-1633633276483-11a57cba322c?auto=format&fit=crop&q=80&w=800'],
        approvalStatus: 'pending'
    }
];

async function seedSanitaryProducts() {
    try {
        const business = await Business.findOne({ businessName: 'Premium Sanitary & Fittings' });

        if (!business) {
            console.error('❌ Business "Premium Sanitary & Fittings" not found!');
            process.exit(1);
        }

        console.log(`Found Business: ${business.businessName} (ID: ${business._id})`);

        // Add businessId to products
        const productsWithBusiness = dummyProducts.map(p => ({
            ...p,
            businessId: business._id
        }));

        await Product.insertMany(productsWithBusiness);
        console.log('✅ Successfully added 5 dummy sanitary products with images for Amit Sharma');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
}

seedSanitaryProducts();
