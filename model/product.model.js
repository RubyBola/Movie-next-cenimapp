const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['food', 'beverage', 'merchandise', 'ticket'],
        default: 'food'
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    imageUrl: {
        type: String,
        default: ''
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Prevent overwrite model error
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);