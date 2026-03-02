const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected for fixing broken image URLs'))
    .catch(err => console.error('mongoDB connection error:', err));

const fixBrokenImages = async () => {
    try {
        const brokenUrl = 'https://images.unsplash.com/photo-1615873968403-89e061884334?auto=format&fit=crop&q=80&w=800';

        // Replacement URLs
        const graniteUrl = 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800'; // Stone texture
        const fanUrl = 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800'; // Furniture/Interior generic

        // Find products with the broken URL
        const products = await Product.find({ images: brokenUrl });

        console.log(`Found ${products.length} products with broken URL.`);

        for (const product of products) {
            console.log(`Fixing product: ${product.productName}`);

            let newUrl = graniteUrl;
            if (product.productName.toLowerCase().includes('fan')) {
                newUrl = fanUrl;
            }

            // Replace the broken URL in the images array
            product.images = product.images.map(img => img === brokenUrl ? newUrl : img);

            await product.save();
            console.log(`✅ Updated images for: ${product.productName}`);
        }

        console.log('🎉 All broken images fixed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error fixing images:', error);
        process.exit(1);
    }
};

fixBrokenImages();
