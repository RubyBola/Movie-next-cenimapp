const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "uploads",
//         allowed_formats: ["jpg", "png", "jpeg"]
//     }
// });
const storage = multer.diskStorage({});
const upload = multer({ storage });

module.exports = upload;