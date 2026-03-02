const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Business = require('./models/Business');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => console.error('MongoDB connection error:', err));

const commonFields = {
    openTime: '09:00',
    closeTime: '20:00',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    payoutCycle: 'weekly',
    emergencyOrders: false,
    deliveryAvailable: true,
    status: 'approved' // Automatically approve for this request
};

const getBankDetails = (name) => ({
    accountNumber: Math.floor(Math.random() * 1000000000000).toString(),
    ifsc: 'HDFC0001234',
    accountHolder: name
});

const businesses = [
    // Existing 6
    {
        businessName: 'Quality Wood & Boards Mart', ownerName: 'Amit Bansal', mobile: '9123456780', email: 'amit@woodmart.com', businessCategory: 'Wood & Board Materials',
        address: 'Sector 4, Timber Market', city: 'Delhi', pincode: '110001', serviceRadius: 20, serviceType: 'wholesale', dailyCapacity: '100', minOrderValue: '15000',
        categories: ['Plywood', 'MDF'], ...commonFields, ...getBankDetails('Amit Bansal')
    },
    {
        businessName: 'Global Electrical Solutions', ownerName: 'Rahul Sharma', mobile: '9123456781', email: 'rahul@globalelectrical.com', businessCategory: 'Electrical Materials',
        address: 'Chandi Chowk', city: 'Delhi', pincode: '110006', serviceRadius: 15, serviceType: 'retail', dailyCapacity: '80', minOrderValue: '2000',
        categories: ['Wires', 'Switches'], ...commonFields, ...getBankDetails('Rahul Sharma')
    },
    {
        businessName: 'Durable Plumbing & Sanitary', ownerName: 'Vikas Gupta', mobile: '9123456782', email: 'vikas@durableplumbing.com', businessCategory: 'Plumbing & Sanitary Materials',
        address: 'Ganesh Gali', city: 'Delhi', pincode: '110002', serviceRadius: 25, serviceType: 'retail', dailyCapacity: '60', minOrderValue: '5000',
        categories: ['Pipes', 'Toilet seats'], ...commonFields, ...getBankDetails('Vikas Gupta')
    },
    {
        businessName: 'Grand Flooring & Wall Decor', ownerName: 'Sanjay Mehra', mobile: '9123456783', email: 'sanjay@grandflooring.com', businessCategory: 'Flooring & Wall Materials',
        address: 'Ring Road', city: 'Gurgaon', pincode: '122001', serviceRadius: 30, serviceType: 'retail', dailyCapacity: '200', minOrderValue: '25000',
        categories: ['Tiles', 'Marble'], ...commonFields, ...getBankDetails('Sanjay Mehra')
    },
    {
        businessName: 'Perfect Finishing Paints & Chemicals', ownerName: 'Deepak Verma', mobile: '9123456784', email: 'deepak@perfectfinishing.com', businessCategory: 'Finishing Materials',
        address: 'Industrial Area', city: 'Noida', pincode: '201301', serviceRadius: 15, serviceType: 'retail', dailyCapacity: '120', minOrderValue: '3000',
        categories: ['Paint', 'Putty'], ...commonFields, ...getBankDetails('Deepak Verma')
    },
    {
        businessName: 'Reliable Hardware & Fixtures Hub', ownerName: 'Vikram Joshi', mobile: '9123456785', email: 'vikram@reliablehardware.com', businessCategory: 'Hardware & Fixtures',
        address: 'Hardware Gali', city: 'Faridabad', pincode: '121001', serviceRadius: 20, serviceType: 'retail', dailyCapacity: '150', minOrderValue: '1000',
        categories: ['Locks', 'Hinges'], ...commonFields, ...getBankDetails('Vikram Joshi')
    },
    // Adding 6 New
    {
        businessName: 'Smart Home Automation Co', ownerName: 'Ishan Goel', mobile: '9123456786', email: 'ishan@smartco.com', businessCategory: 'Smart Home Devices',
        address: 'Cyber Tech Park', city: 'Bangalore', pincode: '560001', serviceRadius: 40, serviceType: 'retail', dailyCapacity: '50', minOrderValue: '10000',
        categories: ['Smart Locks', 'Hubs'], ...commonFields, ...getBankDetails('Ishan Goel')
    },
    {
        businessName: 'Apex HVAC & Cooling Systems', ownerName: 'Karan Malik', mobile: '9123456787', email: 'karan@apexhvac.com', businessCategory: 'HVAC Systems',
        address: 'Okhla Industrial Est', city: 'Delhi', pincode: '110020', serviceRadius: 25, serviceType: 'wholesale', dailyCapacity: '40', minOrderValue: '50000',
        categories: ['Air Conditioners', 'Cooling Units'], ...commonFields, ...getBankDetails('Karan Malik')
    },
    {
        businessName: 'AquaShield Waterproofing', ownerName: 'Manish Singh', mobile: '9123456788', email: 'manish@aquashield.com', businessCategory: 'Waterproofing Solutions',
        address: 'Sec 18', city: 'Noida', pincode: '201301', serviceRadius: 30, serviceType: 'retail', dailyCapacity: '100', minOrderValue: '5000',
        categories: ['Coatings', 'Membranes'], ...commonFields, ...getBankDetails('Manish Singh')
    },
    {
        businessName: 'Modern Kitchen Designers', ownerName: 'Nitin Pandey', mobile: '9123456789', email: 'nitin@modernkitchen.com', businessCategory: 'Modular Kitchen Experts',
        address: 'Hauz Khas', city: 'Delhi', pincode: '110016', serviceRadius: 15, serviceType: 'retail', dailyCapacity: '20', minOrderValue: '100000',
        categories: ['Cabinets', 'Chisels'], ...commonFields, ...getBankDetails('Nitin Pandey')
    },
    {
        businessName: 'Heavy Duty Tool & Power', ownerName: 'Pankaj Kumar', mobile: '9123456790', email: 'pankaj@heavytools.com', businessCategory: 'Hand Tools & Power Tools',
        address: 'Timber Market', city: 'Delhi', pincode: '110006', serviceRadius: 20, serviceType: 'wholesale', dailyCapacity: '150', minOrderValue: '5000',
        categories: ['Drills', 'Saws'], ...commonFields, ...getBankDetails('Pankaj Kumar')
    },
    {
        businessName: 'SafeGuard PPE & Equipment', ownerName: 'Rajiv Chawla', mobile: '9123456791', email: 'rajiv@safeguard.com', businessCategory: 'Safety Equipment',
        address: 'Mandoli Industrial area', city: 'Delhi', pincode: '110093', serviceRadius: 50, serviceType: 'wholesale', dailyCapacity: '300', minOrderValue: '2000',
        categories: ['Helmets', 'Gloves'], ...commonFields, ...getBankDetails('Rajiv Chawla')
    }
];

async function seedBusinesses() {
    try {
        await Business.deleteMany({});
        console.log('Existing businesses cleared');
        const hashedPassword = await bcrypt.hash('password123', 10);
        for (const businessData of businesses) {
            let user = await User.findOne({ phone: businessData.mobile });
            if (!user) {
                user = new User({ name: businessData.ownerName, phone: businessData.mobile, email: businessData.email, password: 'password123', role: 'admin' });
                await user.save();
            }
            const business = new Business({ ...businessData, userId: user._id, password: hashedPassword });
            await business.save();
            console.log(`✅ Created Business: ${business.businessName}`);
        }
        console.log('\n🎉 Database seeding completed with 12 businesses!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedBusinesses();
