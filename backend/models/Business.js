const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    // Step 1: Basic Details
    businessName: { type: String, required: true },
    ownerName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    businessCategory: { type: String, required: true },

    // Step 2: Location
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
    },
    serviceRadius: { type: Number, required: true },
    landmark: { type: String },

    // Step 3: Capacity
    serviceType: { type: String, required: true },
    dailyCapacity: { type: String, required: true },
    minOrderValue: { type: String, required: true },
    deliveryAvailable: { type: Boolean, default: false },
    deliveryCharge: { type: String },

    // Step 4: Products
    categories: [{ type: String }],
    brands: { type: Object },
    priceRanges: { type: Object },
    stockLevels: { type: Object },

    // Step 5: Legal
    gstNumber: { type: String },
    shopLicense: { type: String },
    panCard: { type: String },
    idProof: { type: String }, // File path

    // Step 6: Working Hours
    workingDays: [{ type: String }],
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    emergencyOrders: { type: Boolean, default: false },

    // Step 7: Payment
    accountNumber: { type: String, required: true },
    ifsc: { type: String, required: true },
    accountHolder: { type: String, required: true },
    payoutCycle: { type: String, required: true },

    // Authentication
    password: { type: String, required: true },

    // Status
    status: { type: String, default: 'pending' }, // pending, approved, rejected
    rejectionReason: { type: String }, // Reason for rejection (if rejected)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to created user account
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', BusinessSchema);
