const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ role: 'superadmin' });
        if (user) {
            console.log('Super Admin found:');
            console.log('Name:', user.name);
            console.log('Phone:', user.phone);
            console.log('Role:', user.role);
            console.log('Password (hashed):', user.password);
        } else {
            console.log('Super Admin NOT found');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkSuperAdmin();
