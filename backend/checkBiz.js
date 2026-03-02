const mongoose = require('mongoose');
require('dotenv').config();
const Business = require('./models/Business');

const listBusinesses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const businesses = await Business.find({}, 'businessName ownerName businessCategory');
        console.log('Current Businesses:', businesses.length);
        businesses.forEach((b, i) => {
            console.log(`${i + 1}. ${b.businessName} (${b.businessCategory})`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listBusinesses();
