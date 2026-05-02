// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { createBooking } = require("../controllers/bookingController");

router.post("/bookings", protect, createBooking);
router.post("/signup",adminSignup)
router.post("/signup",adminSignup)
router.post("/signup",adminSignup)
router.post("/signup",adminSignup)
router.post("/signup",adminSignup)
router.post("/signup",adminSignup)


module.exports = router;