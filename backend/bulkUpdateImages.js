const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected for bulk updating images'))
    .catch(err => console.error('mongoDB connection error:', err));

const productsToUpdate = [
    // Royal Tiles & Ceramics
    {
        name: 'Italian Marble Slab',
        images: ['https://images.unsplash.com/photo-1627641249764-bb8361044439?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Anti-Skid Bathroom Floor Tile',
        images: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Granite Countertop Slab',
        images: ['https://images.unsplash.com/photo-1615873968403-89e061884334?auto=format&fit=crop&q=80&w=800']
    },

    // Bright Lights & Electricals
    {
        name: 'Smart LED Bulb 9W',
        images: ['https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Crystal Chandelier Modern',
        images: ['https://images.unsplash.com/photo-1543198126-a8d873ee72fa?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Modular Switch Board (8 Module)',
        images: ['https://m.media-amazon.com/images/I/61kI2Y4cjdL._SL1500_.jpg']
    },
    {
        name: 'High Speed Ceiling Fan',
        images: ['https://images.unsplash.com/photo-1615873968403-89e061884334?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'LED Slim Panel Light 15W',
        images: ['https://5.imimg.com/data5/SELLER/Default/2021/4/MI/MI/MI/1234567/led-slim-panel-light-15w-500x500.jpg']
    },

    // Woodcraft Furniture Materials
    {
        name: 'Premium Teak Plywood 18mm',
        images: ['https://images.unsplash.com/photo-1517646133927-4a0b252069e2?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Decorative Laminate Sheet (Wood Finish)',
        images: ['https://images.unsplash.com/photo-1540932296774-633b43db8db7?auto=format&fit=crop&q=80&w=800']
    },
    {
        name: 'Soft Close Drawer Channels (Pair)',
        images: ['https://m.media-amazon.com/images/I/61X-7q4vBFL._SX425_.jpg']
    },
    {
        name: 'Commercial Flush Door',
        images: ['https://5.imimg.com/data5/SELLER/Default/2022/9/VK/VK/VK/12345/commercial-flush-door-500x500.jpg']
    },
    {
        name: 'Hydraulic Bed Lift Mechanism',
        images: ['https://m.media-amazon.com/images/I/61+9E+9E+9L._AC_SL1500_.jpg']
    }
];

const updateAllImages = async () => {
    try {
        console.log('Starting bulk image update...');

        for (const item of productsToUpdate) {
            const product = await Product.findOne({ productName: item.name });

            if (product) {
                // Only update if no images exist or if explicitly wanting to overwrite (here we overwrite for demo)
                product.images = item.images;
                await product.save();
                console.log(`✅ Updated images for: ${product.productName}`);
            } else {
                console.warn(`⚠️ Product not found: ${item.name}`);
            }
        }

        console.log('🎉 All product images updated successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error updating images:', error);
        process.exit(1);
    }
};

updateAllImages();
