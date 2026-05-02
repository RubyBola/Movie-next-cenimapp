const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Movie title is required'],
        trim: true
    },
    genre: {
        type: String,
        required: [true, 'Genre is required']
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    language: {
        type: String,
        default: 'English'
    },
    posterUrl: {
        type: String,
        default: ''
    },
    posterBg: {
        type: String,
        default: 'linear-gradient(135deg, #1f2937, #111827)'
    },
    description: {
        type: String,
        default: ''
    },
    showtimes: [{
        type: String,
        required: true
    }],
    price: {
        type: Number,
        default: 12.5
    },
    releaseDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);