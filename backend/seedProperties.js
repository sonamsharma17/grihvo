const mongoose = require('mongoose');
const Property = require('./models/Property');
require('dotenv').config();

const dummyProperties = [
    {
        title: 'Luxury 3 BHK Villa in Vasant Kunj',
        type: 'House',
        price: 45000000,
        location: 'Vasant Kunj, Delhi',
        area: '2500 sqft',
        description: 'Beautifully designed luxury villa with modular kitchen, spacious rooms, and a private garden.',
        images: ['https://images.unsplash.com/photo-1580587771525-78b9bed3b918?auto=format&fit=crop&q=80&w=800'],
        sellerName: 'Rajesh Khanna',
        sellerPhone: '9811002233'
    },
    {
        title: 'Residential Plot for Sale',
        type: 'Plot',
        price: 8500000,
        location: 'Rohini Sector 24, Delhi',
        area: '100 sq yard',
        description: 'Prime location residential plot, corner property, near main road and park.',
        images: ['https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=800'],
        sellerName: 'Suresh Mehra',
        sellerPhone: '9822334455'
    },
    {
        title: 'Modern 2 BHK Apartment',
        type: 'Flat',
        price: 6500000,
        location: 'Indirapuram, Ghaziabad',
        area: '1150 sqft',
        description: 'Newly constructed 2 BHK flat with all modern amenities, gym, and parking.',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
        sellerName: 'Amit Shah',
        sellerPhone: '9833445566'
    },
    {
        title: 'Commercial Shop in Prime Market',
        type: 'Commercial',
        price: 12000000,
        location: 'Laxmi Nagar, Delhi',
        area: '450 sqft',
        description: 'Ground floor shop in a busy market area, perfect for retail business.',
        images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'],
        sellerName: 'Vijay Kumar',
        sellerPhone: '9844556677'
    },
    {
        title: 'Beautiful Farmhouse with Pool',
        type: 'House',
        price: 150000000,
        location: 'Chattarpur, Delhi',
        area: '2 Acres',
        description: 'Sprawling farmhouse with swimming pool, landscaped gardens, and 5 luxurious bedrooms.',
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'],
        sellerName: 'Priya Malhotra',
        sellerPhone: '9855667788'
    },
    {
        title: 'Industrial Plot near NH8',
        type: 'Plot',
        price: 25000000,
        location: 'Manesar, Gurgaon',
        area: '500 sq yard',
        description: 'Industrial plot suitable for warehouse or small factory, excellent connectivity.',
        images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800'],
        sellerName: 'Sanjay Gupta',
        sellerPhone: '9866778899'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for property seeding...');

        await Property.deleteMany({});
        console.log('Cleared existing properties.');

        await Property.insertMany(dummyProperties);
        console.log(`Successfully added ${dummyProperties.length} dummy properties!`);

        mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('Error seeding properties:', error);
        process.exit(1);
    }
};

seedDB();
