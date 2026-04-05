const express = require("express")
const { signup, login, loop, updateUser, updatePassword, uploadProfileImage, fetchUser,verifyEmail,loginUser,uploadProduct,forgotPassword,resetPassword} = require("../controller/signup.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");


router.post("/api/signup", signup)
router.post("/api/login", login)
router.put("/api/update-user/:id", updateUser)
router.get("/api/loop", loop)
router.put("/api/update-password/:id", updatePassword)
router.post("/upload-pic", protect, upload.single("image"), uploadProfileImage)
router.get("/api", protect, fetchUser)
router.post("/api/verify-email", verifyEmail)
router.post("/api/login", loginUser);
router.post("/api/products", uploadProduct);
router.post("/api/forgot-password", forgotPassword);
router.post("/api/reset-password", resetPassword);

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

module.exports = router