const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const { createProduct} = require("../controller/product.controller");

router.post("/", protect, upload.single("image"),createProduct);

module.exports = router;