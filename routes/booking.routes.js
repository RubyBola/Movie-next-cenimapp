const express = require("express")
const {verifyEmail, getMovieById, createBooking, getUserBookings, cancelBooking, getBookedSeats, Login, Signup} = require("../controller/booking.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");
const booking = require("../model/booking");


// router.post("/Login",Login);
// router.post("/verify-email", verifyEmail);
// router.post("/Signup",Signup)
router.get("/getmovie/:id",protect,getMovieById)
router.post("/",protect,createBooking)
router.get("/getUserBookings",protect,getUserBookings)
router.delete("/cancel-Booking/:id",protect,cancelBooking)
router.get("/getbookedseats/:movieId",protect,getBookedSeats)
// router.post("/user/booking", booking )















module.exports = router;