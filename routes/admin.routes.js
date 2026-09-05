const express = require("express")
const {adminLogin, adminSignup, verifyEmail, verifyAdminEmail,adminForgotPassword,adminResetPassword,} = require("../controller/signup.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");
const { getMovies } = require("../controller/booking.controller");
const {getAllMovies, addMovie, deleteMovie, updateMovie, getAllBookings,getDashboard } = require("../controller/admin.controller");
const adminProtect = require("../middleware/admin");



router.post("/login",adminLogin);
router.post("/verify-Email",verifyAdminEmail);
router.post("/signup",adminSignup)
router.post("/forgot-password",adminProtect,adminForgotPassword);
router.post("/reset-password", adminProtect, adminResetPassword);
router.get("/getallmovies",adminProtect,getAllMovies)
router.get("/getmovies",adminProtect,getMovies)
router.post("/addmovies",adminProtect,addMovie)
router.delete("/deletemovie/:id",adminProtect,deleteMovie)
router.put("/updatemovies/:id",adminProtect,updateMovie)
router.get("/getallbookings",adminProtect,getAllBookings)
router.get("/getDashboard",adminProtect,getDashboard);













module.exports = router;