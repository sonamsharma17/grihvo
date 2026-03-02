const mongoose = require('mongoose');
const Worker = require('./models/Worker');
require('dotenv').config();

const dummyWorkers = [
    // Existing Labours
    { type: 'Labour', name: 'Aarav Sharma', phone: '9876543230', password: 'password123', address: 'Delhi Cantt, New Delhi', aadhar: '323456789012', age: 28 },
    { type: 'Labour', name: 'Rohan Singh', phone: '9876543231', password: 'password123', address: 'Sector 45, Gurgaon', aadhar: '323456789013', age: 34 },
    { type: 'Labour', name: 'Aditya Mishra', phone: '9876543232', password: 'password123', address: 'Indirapuram, Ghaziabad', aadhar: '323456789014', age: 40 },
    { type: 'Labour', name: 'Rahul Yadav', phone: '9876543233', password: 'password123', address: 'Noida Sector 18', aadhar: '323456789015', age: 25 },
    { type: 'Labour', name: 'Arjun Tiwari', phone: '9876543234', password: 'password123', address: 'Rohini, Delhi', aadhar: '323456789016', age: 31 },
    { type: 'Labour', name: 'Shivam Pandey', phone: '9876543235', password: 'password123', address: 'Paharganj, Delhi', aadhar: '323456789017', age: 45 },
    { type: 'Labour', name: 'Karan Malhotra', phone: '9876543236', password: 'password123', address: 'Dwarka, Delhi', aadhar: '323456789018', age: 38 },
    { type: 'Labour', name: 'Ayush Choudhary', phone: '9876543237', password: 'password123', address: 'Laxmi Nagar, Delhi', aadhar: '323456789019', age: 29 },
    { type: 'Labour', name: 'Varun Saxena', phone: '9876543238', password: 'password123', address: 'Mayur Vihar, Delhi', aadhar: '323456789020', age: 33 },
    { type: 'Labour', name: 'Aman Thakur', phone: '9876543239', password: 'password123', address: 'Janakpuri, Delhi', aadhar: '323456789021', age: 27 },

    // Existing Professionals
    { type: 'Professional', category: 'Carpenter', name: 'Ananya Gupta', phone: '9998887780', password: 'password123', address: 'Vasant Vihar, Delhi', aadhar: '423456789012', age: 30 },
    { type: 'Professional', category: 'Painter', name: 'Priya Verma', phone: '9998887781', password: 'password123', address: 'Saket, Delhi', aadhar: '423456789013', age: 29 },
    { type: 'Professional', category: 'Whitewasher', name: 'Kavya Patel', phone: '9998887782', password: 'password123', address: 'Hauz Khas, Delhi', aadhar: '423456789014', age: 32 },
    { type: 'Professional', category: 'Interior Designer', name: 'Sneha Jain', phone: '9998887783', password: 'password123', address: 'Greater Kailash, Delhi', aadhar: '423456789015', age: 27 },
    { type: 'Professional', category: 'POP Designer', name: 'Meera Kapoor', phone: '9998887784', password: 'password123', address: 'Preet Vihar, Delhi', aadhar: '423456789016', age: 35 },
    { type: 'Professional', category: 'Tile/Flooring', name: 'Aditi Srivastava', phone: '9998887785', password: 'password123', address: 'Janakpuri, Delhi', aadhar: '423456789017', age: 31 },
    { type: 'Professional', category: 'Carpenter', name: 'Riya Das', phone: '9998887786', password: 'password123', address: 'Model Town, Delhi', aadhar: '423456789018', age: 28 },
    { type: 'Professional', category: 'Painter', name: 'Tanvi Mehta', phone: '9998887787', password: 'password123', address: 'Pitampura, Delhi', aadhar: '423456789019', age: 40 },
    { type: 'Professional', category: 'Interior Designer', name: 'Shreya Roy', phone: '9998887788', password: 'password123', address: 'Connaught Place, Delhi', aadhar: '423456789020', age: 33 },
    { type: 'Professional', category: 'POP Designer', name: 'Isha Bansal', phone: '9998887789', password: 'password123', address: 'Malviya Nagar, Delhi', aadhar: '423456789021', age: 26 },

    // 50+ More Dummy Data
    { type: 'Professional', category: 'Plumber', name: 'Vikram Joshi', phone: '9123456701', password: 'password123', address: 'Cyber City, Gurgaon', aadhar: '523456789012', age: 35 },
    { type: 'Professional', category: 'Plumber', name: 'Sanjay Rawat', phone: '9123456702', password: 'password123', address: 'Sector 62, Noida', aadhar: '523456789013', age: 42 },
    { type: 'Professional', category: 'Electrician', name: 'Deepak Verma', phone: '9123456703', password: 'password123', address: 'Rajouri Garden, Delhi', aadhar: '523456789014', age: 28 },
    { type: 'Professional', category: 'Electrician', name: 'Amit Negi', phone: '9123456704', password: 'password123', address: 'DLF Phase 3, Gurgaon', aadhar: '523456789015', age: 31 },
    { type: 'Professional', category: 'Tile Worker', name: 'Manoj Kumar', phone: '9123456705', password: 'password123', address: 'Dwarka Sector 10, Delhi', aadhar: '523456789016', age: 33 },
    { type: 'Professional', category: 'Welder', name: 'Rajesh Solanki', phone: '9123456706', password: 'password123', address: 'Okhla Phase 3, Delhi', aadhar: '523456789017', age: 39 },
    { type: 'Professional', category: 'POP Worker', name: 'Suresh Pal', phone: '9123456707', password: 'password123', address: 'Sarita Vihar, Delhi', aadhar: '523456789018', age: 29 },
    { type: 'Professional', category: 'Ceiling Worker', name: 'Kamal Kishore', phone: '9123456708', password: 'password123', address: 'Faridabad NIT, Haryana', aadhar: '523456789019', age: 36 },
    { type: 'Professional', category: 'Mason', name: 'Harish Chander', phone: '9123456709', password: 'password123', address: 'Bhiwadi, Rajasthan', aadhar: '523456789020', age: 45 },
    { type: 'Professional', category: 'Site Supervisor', name: 'Pankaj Bisht', phone: '9123456710', password: 'password123', address: 'Greater Noida West', aadhar: '523456789021', age: 38 },
    { type: 'Professional', category: 'Interior Worker', name: 'Rakesh Yadav', phone: '9123456711', password: 'password123', address: 'Karol Bagh, Delhi', aadhar: '523456789022', age: 32 },
    { type: 'Professional', category: 'Fabricator', name: 'Vinod Sharma', phone: '9123456712', password: 'password123', address: 'Mayapuri Industrial Area', aadhar: '523456789023', age: 40 },
    { type: 'Professional', category: 'Modular Kitchen Installer', name: 'Arun Mehra', phone: '9123456713', password: 'password123', address: 'Kirti Nagar, Delhi', aadhar: '523456789024', age: 34 },
    { type: 'Professional', category: 'Flooring Expert', name: 'Sunil Paswan', phone: '9123456714', password: 'password123', address: 'Palam, New Delhi', aadhar: '523456789025', age: 37 },
    { type: 'Professional', category: 'Waterproofing Specialist', name: 'Naresh Kumar', phone: '9123456715', password: 'password123', address: 'Old Gurgaon', aadhar: '523456789026', age: 41 },
    { type: 'Professional', category: 'HVAC Technician', name: 'Bobby Singh', phone: '9123456716', password: 'password123', address: 'Munirka, Delhi', aadhar: '523456789027', age: 30 },
    { type: 'Professional', category: 'Contractor', name: 'Ashok Tyagi', phone: '9123456717', password: 'password123', address: 'Ghaziabad City', aadhar: '523456789028', age: 50 },
    { type: 'Professional', category: 'Civil Engineer', name: 'Rahul Gautam', phone: '9123456718', password: 'password123', address: 'Sahibabad, Ghaziabad', aadhar: '523456789029', age: 28 },
    { type: 'Professional', category: 'Structural Engineer', name: 'Vikas Gupta', phone: '9123456719', password: 'password123', address: 'Hauz Khas Enclave', aadhar: '523456789030', age: 45 },
    { type: 'Professional', category: 'Architect', name: 'Suhani Shah', phone: '9123456720', password: 'password123', address: 'Green Park, Delhi', aadhar: '523456789031', age: 32 },
    { type: 'Professional', category: 'Landscape Designer', name: 'Megha Singh', phone: '9123456721', password: 'password123', address: 'Sushant Lok, Gurgaon', aadhar: '523456789032', age: 29 },
    { type: 'Professional', category: 'Project Manager', name: 'Naveen Jindal', phone: '9123456722', password: 'password123', address: 'Golf Course Road, Gurgaon', aadhar: '523456789033', age: 40 },
    { type: 'Professional', category: 'Quantity Surveyor', name: 'Kushal Tandon', phone: '9123456723', password: 'password123', address: 'Noida Sector 15', aadhar: '523456789034', age: 31 },
    { type: 'Professional', category: 'Paint Dealer', name: 'Birender Singh', phone: '9123456724', password: 'password123', address: 'Chawri Bazar, Delhi', aadhar: '523456789035', age: 48 },
    { type: 'Professional', category: 'Tiles & Marble Seller', name: 'Harish Marble', phone: '9123456725', password: 'password123', address: 'Kishangarh, Rajasthan', aadhar: '523456789036', age: 44 },
    { type: 'Professional', category: 'Hardware Shop Owner', name: 'Raj Kumar', phone: '9123456726', password: 'password123', address: 'Loha Mandi, Delhi', aadhar: '523456789037', age: 52 },
    { type: 'Professional', category: 'Electrical Material Supplier', name: 'Sunil Electric', phone: '9123456727', password: 'password123', address: 'Bhagirath Palace, Delhi', aadhar: '523456789038', age: 46 },
    { type: 'Professional', category: 'Furniture Vendor', name: 'Modern House', phone: '9123456728', password: 'password123', address: 'Amar Colony, Delhi', aadhar: '523456789039', age: 39 },
    { type: 'Professional', category: 'False Ceiling Designer', name: 'Jitender POP', phone: '9123456729', password: 'password123', address: 'Burari, Delhi', aadhar: '523456789040', age: 30 },
    { type: 'Professional', category: 'Modular Wardrobe Expert', name: 'Sandeep Wood', phone: '9123456730', password: 'password123', address: 'Shalimar Bagh, Delhi', aadhar: '523456789041', age: 35 },
    { type: 'Professional', category: 'Curtain & Lighting Designer', name: 'Isha Interiors', phone: '9123456731', password: 'password123', address: 'South Extension, Delhi', aadhar: '523456789042', age: 27 },
    { type: 'Professional', category: 'Interior Decorator', name: 'Kavita Roy', phone: '9123456732', password: 'password123', address: 'New Town, Kolkata', aadhar: '523456789043', age: 33 },
    { type: 'Professional', category: 'Smart Home Installation Expert', name: 'Tech Solutions', phone: '9123456733', password: 'password123', address: 'Hitech City, Hyderabad', aadhar: '523456789044', age: 29 },
    { type: 'Professional', category: 'Modular Kitchen Expert', name: 'Kitchen Masters', phone: '9123456734', password: 'password123', address: 'Whitefield, Bangalore', aadhar: '523456789045', age: 34 },
    { type: 'Labour', name: 'Chhotu Lal', phone: '9123456735', password: 'password123', address: 'Sultanpur Village, Delhi', aadhar: '523456789046', age: 24 },
    { type: 'Labour', name: 'Ramu Kaka', phone: '9123456736', password: 'password123', address: 'Narela, Delhi', aadhar: '523456789047', age: 50 },
    { type: 'Professional', category: 'Plumber', name: 'Nitin Pandey', phone: '9123456737', password: 'password123', address: 'Vatika City, Gurgaon', aadhar: '523456789048', age: 28 },
    { type: 'Professional', category: 'Electrician', name: 'Om Prakash', phone: '9123456738', password: 'password123', address: 'Uttam Nagar, Delhi', aadhar: '523456789049', age: 36 },
    { type: 'Professional', category: 'Painter', name: 'Lalit Rawat', phone: '9123456739', password: 'password123', address: 'Dilshad Garden, Delhi', aadhar: '523456789050', age: 31 },
    { type: 'Professional', category: 'Carpenter', name: 'Mahesh Vishwakarma', phone: '9123456740', password: 'password123', address: 'Yamuna Vihar, Delhi', aadhar: '523456789051', age: 40 },
    { type: 'Professional', category: 'Mason', name: 'Dinesh Prasad', phone: '9123456741', password: 'password123', address: 'Najafgarh, Delhi', aadhar: '523456789052', age: 44 },
    { type: 'Professional', category: 'Site Supervisor', name: 'Somesh Gupta', phone: '9123456742', password: 'password123', address: 'Sector 15, Gurgaon', aadhar: '523456789053', age: 35 },
    { type: 'Professional', category: 'Interior Designer', name: 'Anjali Sharma', phone: '9123456743', password: 'password123', address: 'Sector 50, Noida', aadhar: '523456789054', age: 30 },
    { type: 'Professional', category: 'Architect', name: 'Tushar Khanna', phone: '9123456744', password: 'password123', address: 'Civil Lines, Delhi', aadhar: '523456789055', age: 38 },
    { type: 'Professional', category: 'Plumber', name: 'Sunil Bharti', phone: '9123456745', password: 'password123', address: 'Indirapuram Shop No 5', aadhar: '523456789056', age: 29 },
    { type: 'Professional', category: 'Electrician', name: 'Rajiv Saxena', phone: '9123456746', password: 'password123', address: 'Vasundhara, Ghaziabad', aadhar: '523456789057', age: 32 },
    { type: 'Professional', category: 'Welder', name: 'Arun Lohar', phone: '9123456747', password: 'password123', address: 'Lohe Wali Gali, Delhi', aadhar: '523456789058', age: 35 },
    { type: 'Professional', category: 'POP Worker', name: 'Ravi Pal', phone: '9123456748', password: 'password123', address: 'Khoda Colony, Noida', aadhar: '523456789059', age: 27 },
    { type: 'Professional', category: 'Ceiling Worker', name: 'Sohan Singh', phone: '9123456749', password: 'password123', address: 'Tila Mor, Ghaziabad', aadhar: '523456789060', age: 30 },
    { type: 'Professional', category: 'Structural Engineer', name: 'Amit Bhardwaj', phone: '9123456750', password: 'password123', address: 'Malviya Nagar Market', aadhar: '523456789061', age: 41 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing workers
        await Worker.deleteMany({});
        console.log('Cleared existing workers.');

        // Insert dummy data
        await Worker.insertMany(dummyWorkers);
        console.log(`Successfully added ${dummyWorkers.length} dummy workers!`);

        mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
