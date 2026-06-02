const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {addToCart} = require("../controller/cart.controller");

router.post("/", protect,addToCart);

module.exports = router;