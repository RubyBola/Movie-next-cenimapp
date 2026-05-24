const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");

const {checkout} = require("../controller/checkout.controller");


// Checkout
router.post("/checkout",protect, checkout);

module.exports = router;