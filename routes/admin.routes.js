const express = require("express")
const {adminLogin, adminSignup, verifyEmail} = require("../controller/signup.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");
const { getMovies } = require("../controller/booking.controller");
const { getAllMovies, addMovie, deleteMovie, updateMovie, getAllBookings } = require("../controller/admin.controller");



router.post("/login", adminLogin);
router.post("/verify-email", verifyEmail);
router.post("/signup",adminSignup)
router.post("/getallmovies",getAllMovies)
router.post("/getmovies",getMovies)
router.post("/addmovies",addMovie)
router.post("/deletemovie",deleteMovie)
router.post("/updatemovies",updateMovie)
router.post("/getallbookings",getAllBookings)













module.exports = router;