const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected for updating floral tile image'))
    .catch(err => console.error('mongoDB connection error:', err));

const updateFloralTileImage = async () => {
    try {
        const productName = 'Ceramic Wall Tile - Floral Decor';
        const newImages = [
            'https://i.etsystatic.com/6959099/r/il/be9bb9/4725071038/il_570xN.4725071038_s2t4.jpg'
        ];

        const product = await Product.findOne({ productName: productName });

        if (!product) {
            console.error(`❌ Product "${productName}" not found!`);
            process.exit(1);
        }

        console.log(`Found Product: ${product.productName} (ID: ${product._id})`);

        product.images = newImages;
        await product.save();

        console.log(`✅ Successfully updated images for "${productName}"`);
        console.log('Images added:', product.images);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating product:', error);
        process.exit(1);
    }
};

updateFloralTileImage();
