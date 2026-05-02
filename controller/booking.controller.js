const Movie = require('../model/movie');
const Booking = require('../model/booking');
const User = require('../model/usermodel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// User registration
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        const user = new User({ name, email, password });
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        
        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all active movies (user view)
const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single movie details
const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create booking
const createBooking = async (req, res) => {
    try {
        const { movieId, showtime, date, seats } = req.body;
        const userId = req.userId;
        
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        // Check if seats are already booked
        const existingBookings = await Booking.find({
            movieId,
            showtime,
            date,
            seats: { $in: seats }
        });
        
        if (existingBookings.length > 0) {
            return res.status(400).json({ error: 'Some seats are already booked' });
        }
        
        const totalPrice = seats.length * 12.5;
        
        const booking = new Booking({
            movieId,
            userId,
            showtime,
            date,
            seats,
            totalPrice
        });
        
        await booking.save();
        
        res.status(201).json({
            success: true,
            booking,
            message: `Booked ${seats.length} seat(s) successfully`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId })
            .populate('movieId', 'title posterBg')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel booking
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findOne({ _id: id, userId: req.userId });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get booked seats for a show
const getBookedSeats = async (req, res) => {
    try {
        const { movieId, showtime, date } = req.query;
        
        const bookings = await Booking.find({
            movieId,
            showtime,
            date,
            status: 'confirmed'
        });
        
        const bookedSeats = bookings.flatMap(b => b.seats);
        
        res.json({ success: true, bookedSeats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {register,login,getMovies,getMovieById,createBooking,getUserBookings,cancelBooking,getBookedSeats};