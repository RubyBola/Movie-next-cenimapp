const Movie = require('../model/movie');
const Booking = require('../model/booking');
const User = require('../model/usermodel');

// Get all movies (admin)
const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add new movie
const addMovie = async (req, res) => {
    try {
        const { title, genre, duration, rating, posterBg, showtimes, description } = req.body;
        
        const movie = new Movie({
            title,
            genre,
            duration,
            rating,
            posterBg,
            showtimes: showtimes.split(',').map(s => s.trim()),
            description
        });
        
        await movie.save();
        res.status(201).json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update movie
const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        if (updates.showtimes && typeof updates.showtimes === 'string') {
            updates.showtimes = updates.showtimes.split(',').map(s => s.trim());
        }
        
        const movie = await Movie.findByIdAndUpdate(id, updates, { new: true });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete movie
const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete all bookings for this movie
        await Booking.deleteMany({ movieId: id });
        
        const movie = await Movie.findByIdAndDelete(id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json({ success: true, message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all bookings (admin)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('movieId', 'title')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
        
        res.json({ 
            success: true, 
            bookings,
            stats: {
                totalBookings: bookings.length,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const totalMovies = await Movie.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();
        
        const revenue = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalMovies,
                totalBookings,
                totalUsers,
                totalRevenue: revenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllMovies, addMovie, updateMovie, deleteMovie, getAllBookings, getDashboardStats};