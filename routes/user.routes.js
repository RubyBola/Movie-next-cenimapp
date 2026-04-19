const express = require("express")
const { signup, login,loop,adminLogin, updateUser, updatePassword, uploadProfileImage, fetchUser,verifyEmail,loginUser,uploadProduct,forgotPassword,resetPassword, adminSignup} = require("../controller/signup.controller");
const upload = require("../middleware/upload");
const protect = require("../middleware/auth")
const router = express.Router()
const cloudinary = require("../config/cloudinary");


router.post("/signup", signup)
router.post("/login", login)
router.put("/update-user/:id", updateUser)
router.get("/loop", loop)
router.put("/update-password/:id", updatePassword)
router.post("/upload-pic", protect, upload.single("image"), uploadProfileImage)
router.get("/, protect", fetchUser)
router.post("/verify-email", verifyEmail)
router.post("/login", loginUser);
router.post("/products", uploadProduct);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/admin/login", adminLogin);
router.post("/admin/signup",adminSignup)



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