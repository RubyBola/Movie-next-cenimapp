const express = require("express")
const {adminLogin, adminSignup, verifyEmail} = require("../controller/signup.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");



router.post("/login", adminLogin);
router.post("/verify-email", verifyEmail);
router.post("/signup",adminSignup)








module.exports = router;