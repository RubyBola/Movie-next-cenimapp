const express = require("express")
const { signup, login,loop,adminLogin, updateUser, updatePassword, uploadProfileImage, fetchUser,verifyEmail,loginUser,uploadProduct,adminSignup, forgotpassword, resetpassword} = require("../controller/signup.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");


router.post("/signup", signup)
router.post("/login", login)
router.put("/update-password/:id", updatePassword)
router.post("/verify-email", verifyEmail)
router.post("/Forgot-password",protect,forgotpassword)
router.post("/Reset-password",protect,resetpassword)




router.post("/upload", (req, res) => {
    upload.single("image")(req, res, (err) => {
        // This catches Cloudinary/multer errors
        if (err) {
            console.error("Upload error:", err);
            return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file received." });
        }
        console.log("File received:", req.file);
        res.json({
            message: "Upload successful",
            image: req.file
        });
    });
});



router.get("/test-cloudinary", async (req, res) => {
    try {
        const result = await cloudinary.api.ping();
        res.json({ status: "Cloudinary connected ✅", result });
    } catch (error) {
        res.status(500).json({ status: "Cloudinary failed ❌", error: error.message });
    }
});

module.exports = router;