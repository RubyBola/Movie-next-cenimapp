const express = require("express")
const {adminLogin, adminSignup, verifyEmail} = require("../controller/signup.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");
const { getMovies } = require("../controller/booking.controller");
const { getAllMovies, addMovie, deleteMovie, updateMovie, getAllBookings } = require("../controller/admin.controller");



router.post("/login", adminLogin);
router.post("/verifyemail", verifyEmail);
router.post("/signup",adminSignup)
router.put("/getallmovies",getAllMovies)
router.post("/getmovies",getMovies)
router.post("/addmovies",addMovie)
router.delete("/deletemovie/:id",deleteMovie)
router.put("/updatemovies/:id",updateMovie)
router.post("/getallbookings",getAllBookings)













module.exports = router;