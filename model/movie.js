const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        default: '0'
    },
    posterBg: {
        type: String,
        default: 'linear-gradient(135deg, #1f2937, #111827)'
    },
    showtimes: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        default: ''
    },
    releaseDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);