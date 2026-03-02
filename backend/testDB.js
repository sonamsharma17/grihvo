const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const Business = require('./models/Business');

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
        const count = await Business.countDocuments();
        console.log('Business count:', count);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();
