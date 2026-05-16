const express = require("express")
const {verifyEmail, getMovieById, createBooking, getUserBookings, cancelBooking, getBookedSeats, Login, Signup} = require("../controller/booking.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");
const { getMovies } = require("../controller/booking.controller");
const { getAllMovies, addMovie, deleteMovie, updateMovie, getAllBookings } = require("../controller/booking.controller");
const createbooking = require("../controller/booking.controller");
const booking = require("../model/booking");


// router.post("/Login",Login);
// router.post("/verify-email", verifyEmail);
// router.post("/Signup",Signup)
router.get("/getmovie/:id",getMovieById)
router.post("/",protect,createBooking)
router.get("/getUserBookings",getUserBookings)
router.delete("/cancel-Booking",cancelBooking)
router.get("/getbookedseats",getBookedSeats)
// router.post("/user/booking", booking )















module.exports = router;