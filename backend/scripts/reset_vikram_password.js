const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ name: 'Vikram Singh' });

        if (!user) {
            console.log('User "Vikram Singh" not found.');
        } else {
            user.password = 'password123';
            await user.save();
            console.log(`Password for ${user.name} (${user.email}) has been reset to: password123`);
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetPassword();
