const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Common Fields
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    images: {
        type: [String],
        default: [],
        validate: {
            validator: function (v) {
                return v.length <= 5;
            },
            message: 'Maximum 5 images allowed per product'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true
    },
    actualPrice: {
        type: Number,
        required: [true, 'Actual price (MRP) is required'],
        min: [0, 'Price cannot be negative']
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Selling price is required'],
        min: [0, 'Price cannot be negative'],
        validate: {
            validator: function (v) {
                return v <= this.actualPrice;
            },
            message: 'Selling price cannot be greater than actual price'
        }
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    minOrderQuantity: {
        type: Number,
        default: 1,
        min: [1, 'Minimum order quantity must be at least 1']
    },

    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    longDescription: {
        type: String,
        trim: true
    },
    unitType: {
        type: String,
        enum: ['Piece', 'Box', 'Kg', 'Meter', 'Sq Ft', 'Coil', 'Roll', 'Litre'],
        required: [true, 'Unit type is required']
    },
    usage: {
        type: [String], // e.g., ["Flooring", "Wall", "Indoor"]
        default: []
    },
    // Resistance & Durability
    isWaterResistant: { type: Boolean, default: false },
    isFireResistant: { type: Boolean, default: false },
    durabilityYears: { type: Number },

    // Legal & Quality
    certifications: {
        type: [String], // e.g., ["ISI", "ISO 9001"]
        default: []
    },
    warranty: {
        type: String, // e.g., "5 Years"
        trim: true
    },
    manufacturingDate: {
        type: Date
    },

    // Category-Specific Fields (Technical Specifications)
    specifications: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Business Reference
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: [true, 'Business ID is required']
    },

    // Product Status
    isActive: {
        type: Boolean,
        default: true
    },

    // Approval Status
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    }
}, {
    timestamps: true
});

// Pre-save hook to calculate discount percentage
// Pre-save hook to calculate discount percentage
productSchema.pre('save', async function () {
    if (this.actualPrice && this.sellingPrice) {
        this.discountPercentage = Math.round(
            ((this.actualPrice - this.sellingPrice) / this.actualPrice) * 100
        );
    }
});

// Index for faster queries
productSchema.index({ businessId: 1, isActive: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
