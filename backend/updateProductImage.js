const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected for updating product images'))
    .catch(err => console.error('mongoDB connection error:', err));

const updateImages = async () => {
    try {
        const productName = 'Premium Vitrified Floor Tile';
        const newImages = [
            'https://5.imimg.com/data5/SELLER/Default/2024/3/396703752/EP/PI/AB/107940632/vitrified-floor-tile.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmgE5HKtHx3qjkUo24Vw683EVpOl3VPfw8Km-C_Tjo9l5odb_utFjWjqBfpn97SSB-ieo&usqp=CAU'
        ];

        const product = await Product.findOne({ productName: productName });

        if (!product) {
            console.error(`❌ Product "${productName}" not found!`);
            process.exit(1);
        }

        console.log(`Found Product: ${product.productName} (ID: ${product._id})`);

        product.images = newImages;
        // Ensure status remains pending if it was pending, or reset to pending if approved/rejected?
        // User didn't specify, but usually updates reset approval. Since it's likely already pending from previous steps, we'll keep it as is or force pending.
        // Let's keep the existing status logic or explicitly set to pending if we want to follow the "update requires approval" rule strictly.
        // For now, just updating images.

        await product.save();
        console.log(`✅ Successfully updated images for "${productName}"`);
        console.log('Images added:', product.images);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating product:', error);
        process.exit(1);
    }
};

updateImages();
