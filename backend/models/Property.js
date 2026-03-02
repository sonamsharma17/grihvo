const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['House', 'Plot', 'Flat', 'Commercial'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    area: {
        type: String, // e.g., "1200 sqft"
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String // URLs
    }],
    sellerName: {
        type: String,
        required: true
    },
    sellerPhone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Sold'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Property', propertySchema);
