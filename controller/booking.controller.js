const Movie = require('../model/movie');
const Booking = require('../model/booking');
const User = require('../model/usermodel');
const jwt = require('jsonwebtoken');
const { signup } = require('./signup.controller');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';


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
console.log(req.user);
  try {

    const {
      movie,
      products,
      showtime,
      bookingDate,
      seats,
      paymentMethod,
    } = req.body;


    // Validate fields
    if (
      !movie ||
      !showtime ||
      !bookingDate ||
      !seats ||
      !products ||
      !paymentMethod 
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    // Validate movie ID
    if (!mongoose.Types.ObjectId.isValid(movie)) {

      return res.status(400).json({
        message: "Invalid movie ID",
      });
    }


    // Find movie
    const foundMovie = await Movie.findById(movie);

    if (!foundMovie) {

      return res.status(404).json({
        message: "Movie not found",
      });
    }


    // Calculate total price
    const totalPrice =
      foundMovie.price * seats.length;
   // Generate booking reference
const bookingReference =
  "CIN" +
  Date.now() +
  Math.floor(Math.random() * 1000);


// Create booking
const booking = await Booking.create({

  bookingReference,

  user: req.user.id,

  movie,

  showtime,

  products,

  bookingDate,

  seats,

  paymentMethod,

  totalPrice,
});

    res.status(201).json({

      message: "Booking successful 🎉",

      booking,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {

    try {

        // Find bookings belonging to logged-in user
        const bookings = await Booking.find({

            user: req.user.id

        })

        // Populate movie details
        .populate("movie")

        // Latest first
        .sort({ createdAt: -1 });


        res.status(200).json({

            message: "Bookings fetched successfully",

            totalBookings: bookings.length,

            bookings
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

// Cancel booking
const cancelBooking = async (req, res) => {

    try {

        const { id } = req.params;

        // Validate booking ID
        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({
                message: "Invalid booking ID"
            });
        }

        // Find booking
        const booking =
            await Booking.findById(id);

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Ensure booking belongs to logged in user
        if (
            booking.user.toString() !==
            req.user.id
        ) {

            return res.status(403).json({
                message: "Access denied"
            });
        }

        // Cancel booking
        booking.status = "cancelled";

        await booking.save();

        res.status(200).json({

            message:
                "Booking cancelled successfully",

            booking
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

// Get booked seats for a show
const getBookedSeats = async (req, res) => {

    try {

        const { movieId } = req.params;

        // Validate movie ID
        if (
            !mongoose.Types.ObjectId.isValid(movieId)
        ) {

            return res.status(400).json({
                message: "Invalid movie ID"
            });
        }

        // Find confirmed bookings
        const bookings = await Booking.find({

            movie: movieId,

            status: "confirmed"
        });

        // Extract all booked seats
        let bookedSeats = [];

        bookings.forEach((booking) => {

            booking.seats.forEach((seat) => {

                bookedSeats.push(seat);
            });
        });

        res.status(200).json({

            message:
                "Booked seats fetched successfully",

            totalBookedSeats:
                bookedSeats.length,

            bookedSeats
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};


module.exports = {getMovies,getMovieById,createBooking,getUserBookings,cancelBooking,getBookedSeats};