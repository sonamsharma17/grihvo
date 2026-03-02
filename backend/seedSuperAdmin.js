const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete any existing superadmin to be safe
        await User.deleteMany({ role: 'superadmin' });
        console.log('Existing superadmin cleared');

        const superAdmin = new User({
            name: 'Super Admin',
            email: 'admin@grihvo.com',
            phone: '9999999999',
            password: 'adminpassword123',
            role: 'superadmin'
        });

        await superAdmin.save();
        console.log('Super Admin created successfully');
        console.log('Phone: 9999999999');
        console.log('Password: adminpassword123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding super admin:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
