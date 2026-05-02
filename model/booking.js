const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    showtime: {
        type: String,
        required: true
    },
    bookingDate: {
        type: String,
        required: true
    },
    seats: [{
        row: Number,
        number: Number,
        seatNumber: String
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'online'],
        default: 'card'
    },
    bookingReference: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', async function(next) {
    if (!this.bookingReference) {
        this.bookingReference = 'CIN' + Date.now() + Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);