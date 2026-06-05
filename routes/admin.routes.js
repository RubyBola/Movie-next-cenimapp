const express = require("express")
const {adminLogin, adminSignup, verifyEmail, verifyAdminEmail} = require("../controller/signup.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");
const { getMovies } = require("../controller/booking.controller");
const { getAllMovies, addMovie, deleteMovie, updateMovie, getAllBookings } = require("../controller/admin.controller");



router.post("/login",adminLogin);
router.post("/verify-Email",verifyAdminEmail);
router.post("/signup",adminSignup)
router.put("/getallmovies",protect,getAllMovies)
router.post("/getmovies",protect,getMovies)
router.post("/addmovies",protect,addMovie)
router.delete("/deletemovie/:id",protect,deleteMovie)
router.put("/updatemovies/:id",protect,updateMovie)













module.exports = router;