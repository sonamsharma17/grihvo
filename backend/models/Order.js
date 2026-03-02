const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: [true, 'Business ID is required']
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Customer ID is required']
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productName: String,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {
        type: String
    },
    customerPhone: {
        type: String
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Generate unique order number before saving
orderSchema.pre('save', async function (next) {
    if (this.isNew && !this.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.orderNumber = `ORD-${timestamp}-${random}`;
    }
    next();
});

// Index for faster queries
orderSchema.index({ businessId: 1, status: 1 });
orderSchema.index({ customerId: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
